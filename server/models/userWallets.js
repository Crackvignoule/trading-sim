const db = require("../database");

async function getTokenAmountByUser(pseudo, tokenName) {
    try {
      const query = `
        SELECT W.tokenName, W.amount
        FROM Wallets W
        JOIN Users U ON W.idUser = U.idUser
        WHERE U.pseudo = ? AND W.tokenName = ?
      `;
      
      const [rows] = await db.query(query, [pseudo, tokenName]);
      
      if (rows.length > 0) {
        return { success: true, data: rows[0] }; // Retourne le premier résultat trouvé
      } else {
        return { success: false, message: "Aucune donnée trouvée pour cet utilisateur et ce token." };
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return { success: false, message: "Erreur lors de la récupération des données." };
    }
  }


async function setUserWallet(amountBuyToken, amountSellToken, priceBuyToken, tradedPair, userPseudo, action, mode) {
  let connection; // Déclare une variable pour stocker la connexion spécifique
  try {
    connection = await db.getConnection(); // Obtient une connexion spécifique du pool
    await connection.beginTransaction(); // Commence une transaction

    const token1 = tradedPair.split("/")[0];
    const token2 = tradedPair.split("/")[1];
    let buyTokenName = action === "buy" ? token1 : token2;
    let sellTokenName = action === "buy" ? token2 : token1;
    if (mode == "market") {
      await connection.query(
        "UPDATE Wallets SET amount = amount + ? WHERE idUser IN (SELECT idUser FROM Users WHERE pseudo = ?) AND tokenName = ?;",
        [amountBuyToken, userPseudo, buyTokenName]
      );

      await connection.query(
        "UPDATE Wallets SET amount = amount - ? WHERE idUser IN (SELECT idUser FROM Users WHERE pseudo = ?) AND tokenName = ?;",
        [amountSellToken, userPseudo, sellTokenName]
      );

      await connection.commit(); // Commit la transaction
      return { success: true, message: "Mise à jour réussie." };
    } else {
      // Gestion des autres modes...
      return { success: false, message: "Mode non pris en charge." };
    }
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Rollback en cas d'erreur
    }
    console.error("Erreur lors de la transaction :", error);
    return { success: false, message: "Erreur lors de la mise à jour des données." };
  } finally {
    if (connection) {
      await connection.release(); // Important : libère la connexion
    }
  }
}
  

async function getUserSolde(userToken) {
  try {
    
    const query = `
      SELECT tokenName, amount FROM Wallets WHERE idUser IN (SELECT idUser FROM Users WHERE userToken = ?);
    `;
    
    // Exécutez la requête avec les paramètres fournis
    const [results] = await db.query(query, [userToken]);
    let userSolde = 0;
    if (results.length > 0) {
      const promises = results.map(async token => {
        if (token.tokenName === "USDT") {
          userSolde += token.amount;
        }
        else{
          const namePair = token.tokenName + "/USDT";
          const queryPrice = `
          SELECT currentPrice FROM PricesHistory ph
          INNER JOIN Pairs p ON p.idPair = ph.idPair
          WHERE p.namePair = ? ORDER BY ph.datePrice DESC LIMIT 1;`;
          
          const [resultPrice] = await db.query(queryPrice, [namePair]);
          userSolde += resultPrice[0].currentPrice * token.amount; 
      }

      });
      await Promise.all(promises);
      userSolde = userSolde.toFixed(4);
      return { success: true, data: userSolde }; // Retourne le premier résultat trouvé
    } else {
      return { success: false, message: "Aucune donnée trouvée pour cet utilisateur et ce token." };
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return { success: false, message: "Erreur lors de la récupération des données." };
  }
}
  
  async function getAllUserSolde(clientsSoldeToken) {
    if(Object.keys(clientsSoldeToken).length !== 0) {
      try {
        const query = `
            SELECT U.userToken, W.tokenName, W.amount
            FROM Wallets W
            JOIN Users U ON W.idUser = U.idUser
            WHERE U.userToken IN (?);
        `;
      
        // Exécutez la requête avec les paramètres fournis
        const [results] = await db.query(query,[clientsSoldeToken]);
        let userSoldes = {};

        // Get the latest prices for all pairs
        const queryPrice = `
            SELECT p.namePair, ph.currentPrice
            FROM Pairs p
            INNER JOIN PricesHistory ph ON p.idPair = ph.idPair
            INNER JOIN (
                SELECT p.namePair, MAX(ph.datePrice) AS maxDate
                FROM PricesHistory ph
                INNER JOIN Pairs p ON p.idPair = ph.idPair
                GROUP BY p.namePair
            ) subq ON p.namePair = subq.namePair AND ph.datePrice = subq.maxDate;
        `;
        const [prices] = await db.query(queryPrice);
        // Convert the prices array to an object for easier lookup
        let pricesObj = {};
        prices.forEach(price => {
            pricesObj[price.namePair] = price.currentPrice;
        });
        if (results.length > 0) {
          let groupedResults = {};
      
          // Group results by userToken
          results.forEach(token => {
              if (!groupedResults[token.userToken]) {
                  groupedResults[token.userToken] = [];
              }
              groupedResults[token.userToken].push(token);
          });
      
          // Calculate the balance for each user
          for (let userToken in groupedResults) {
              userSoldes[userToken] = 0;
              groupedResults[userToken].forEach(token => {
                  if (token.tokenName === "USDT") {
                      userSoldes[userToken] += token.amount;
                  } else {
                      const namePair = token.tokenName + "/USDT";
                      userSoldes[userToken] += pricesObj[namePair] * token.amount; 
                  }
              });
              userSoldes[userToken] = userSoldes[userToken].toFixed(2);
          }
      
          // Convert the userSoldes object to an array of objects
          const userSoldesArray = Object.keys(userSoldes).map(userToken => ({
              userToken: userToken,
              userSolde: userSoldes[userToken]
          }));
      
          return { success: true, data: userSoldesArray };
      } else {
          return { success: false, message: "Aucune donnée trouvée pour ces utilisateurs et ces tokens." };
      }
      
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return { success: false, message: "Erreur lors de la récupération des données." };
      }
    }
    else {
      return { success: false };
    }
}

async function setUserWalletHistory(userToken, userSolde, dateWallet) {
  try {
    const query = `
      INSERT INTO WalletsHistory (idUser, total, dateWallet)
      SELECT idUser, ?, ?
      FROM Users
      WHERE userToken = ?
    `;
    const values = [userSolde, dateWallet, userToken];
    await db.query(query, values);
  } catch (error) {
    console.error("Error updating WalletsHistory:", error);
    throw error;
  }
}

async function getRanking() {
  const query = `
  SELECT 
    u.idUser,
    u.pseudo,
    wh_latest.total AS latest_total,
    (wh_latest.total - wh_24h_prior.total) AS evolution_24h,
    COALESCE(TIMESTAMPDIFF(SECOND, wh_first.dateWallet, wh_latest.dateWallet), 
             TIMESTAMPDIFF(SECOND, u.dateCrea, wh_latest.dateWallet)) AS time_played_seconds
FROM 
    Users u
JOIN 
    (
        SELECT 
            idUser, 
            total,
            dateWallet
        FROM 
            WalletsHistory
        WHERE 
            (idUser, dateWallet) IN (
                SELECT 
                    idUser, 
                    MAX(dateWallet)
                FROM 
                    WalletsHistory
                GROUP BY 
                    idUser
            )
    ) wh_latest 
    ON u.idUser = wh_latest.idUser
LEFT JOIN 
    (
        SELECT 
            wh1.idUser,
            wh1.total,
            wh1.dateWallet
        FROM 
            WalletsHistory wh1
        JOIN 
            (
                SELECT 
                    idUser, 
                    MAX(dateWallet) AS dateWallet
                FROM 
                    WalletsHistory
                WHERE 
                    dateWallet <= (SELECT MAX(dateWallet) FROM WalletsHistory) - INTERVAL 24 HOUR
                GROUP BY 
                    idUser
            ) wh2 
            ON wh1.idUser = wh2.idUser 
            AND wh1.dateWallet = wh2.dateWallet
    ) wh_24h_prior 
    ON u.idUser = wh_24h_prior.idUser
JOIN 
    (
        SELECT 
            idUser, 
            total,
            dateWallet
        FROM 
            WalletsHistory
        WHERE 
            (idUser, dateWallet) IN (
                SELECT 
                    idUser, 
                    MIN(dateWallet)
                FROM 
                    WalletsHistory
                GROUP BY 
                    idUser
            )
    ) wh_first 
    ON u.idUser = wh_first.idUser
GROUP BY
    u.idUser,
    u.pseudo,
    wh_latest.total,
    wh_24h_prior.total,
    wh_latest.dateWallet,
    wh_first.dateWallet,
    u.dateCrea
ORDER BY 
    latest_total DESC;
  `;

  try {
    const [results] = await db.query(query);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = { getTokenAmountByUser, setUserWallet, getUserSolde, getAllUserSolde, setUserWalletHistory, getRanking } ;