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
        const [results] = await db.query(query,[Object.keys(clientsSoldeToken)]);

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
            results.forEach(token => {
                if (!userSoldes[token.userToken]) {
                    userSoldes[token.userToken] = 0;
                }

                if (token.tokenName === "USDT") {
                  userSoldes[token.userToken] += token.amount;
                } else {
                    const namePair = token.tokenName + "/USDT";
                    // Subtract the value in USDT of the new cryptocurrency from the user's balance
                    userSoldes[token.userToken] += (pricesObj[namePair] * token.amount) - token.amount; 
                }
            });

            // Convert each userSolde to a fixed decimal number
            for (let userToken in userSoldes) {
                userSoldes[userToken] = userSoldes[userToken].toFixed(4);
            }

            // Convert the userSoldes object to an array of objects
            const userSoldesArray = Object.keys(userSoldes).map(userToken => ({
                userToken: userToken,
                userSolde: userSoldes[userToken]
            }));

            return { success: true, data: userSoldesArray }; // Return the userSoldes array
        } else {
            return { success: false, message: "Aucune donnée trouvée pour ces utilisateurs et ces tokens." };
        }
      
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return { success: false, message: "Erreur lors de la récupération des données." };
      }
    }
    else {
      return { success: false, message: "Aucun utilisateur enregistré sur wss4." };
    }
}

module.exports = { getTokenAmountByUser, setUserWallet, getUserSolde, getAllUserSolde };