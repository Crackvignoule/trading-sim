const db = require("../database");
const moment = require('moment');


async function addNewTransaction(userPseudo, tradedPair, tokenPrice, amountToken, total, typeTransaction, direction, statut) {
    let dateTransaction = new Date(Date.now());
  
    const query = `
      INSERT INTO Transactions (idUser, pair, price, amount, total, dateTrans, type, direction, statut)
      SELECT u.idUser, ?, ?, ?, ?, ?, ?, ?, ?
      FROM Users u
      WHERE u.pseudo = ?;
    `;
  
    try {
      const [results] = await db.query(query, [
        tradedPair,
        tokenPrice,
        amountToken,
        total,
        dateTransaction,
        typeTransaction,
        direction,
        statut,
        userPseudo,
      ]);
      const dateTransFormatted = moment(dateTransaction).format('YYYY-MM-DD HH:mm:ss');
      data = {date: dateTransFormatted, pair: tradedPair, type: typeTransaction, direction: direction, price: tokenPrice, amount: amountToken, total: total, idTrans: results.insertId, statut: statut};
      return { success: true, data:data, message: "Transaction ajoutée avec succès." };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction :", error);
      return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
  }
  
async function getUserOpenedOrder(userSpeudo) {

  const query = `
    SELECT dateTrans, pair, type, direction, price, amount, total, idTrans FROM Transactions T
    INNER JOIN Users U ON U.idUser = T.idUser
    WHERE U.pseudo = ? AND T.statut = 'Opened'
    ORDER BY dateTrans DESC;
  `;

  try {
    const [results] = await db.query(query, [
      userSpeudo
    ]);

    const formattedResults = results.map(transaction => ({
      ...transaction,
      dateTrans: moment(transaction.dateTrans).format('YYYY-MM-DD HH:mm:ss')
    }));
    return { success: true, data:formattedResults, message: "Ordres ouverts récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}
  

async function getUserOrderHistory(userSpeudo) {

  const query = `
    SELECT dateTrans, pair, type, direction, price, amount, total, statut FROM Transactions T
    INNER JOIN Users U ON U.idUser = T.idUser
    WHERE U.pseudo = ? AND T.statut = 'Executed' OR T.statut = 'Cancelled'
    ORDER BY dateTrans DESC;
  `;

  try {
    const [results] = await db.query(query, [
      userSpeudo
    ]);

    const formattedResults = results.map(transaction => ({
      ...transaction,
      dateTrans: moment(transaction.dateTrans).format('YYYY-MM-DD HH:mm:ss')
    }));
    return { success: true, data:formattedResults, message: "Historique des Ordres récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

async function deleteTransation(idTrans) {

  const query = `
    UPDATE Transactions SET statut = ? WHERE idTrans = ?;
  `;

  try {
    const [results] = await db.query(query, [
      "Cancelled",
      idTrans
    ]);

    const data = {idTrans: idTrans, statut : "Cancelled"};
    return { success: true, data: data, message: "Ordre supprimé avec succès." };
  } catch (error) {
    console.error("Erreur lors de suppresion de l'ordre :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

async function deleteAllUserTransation(userSpeudo) {

  const query = `
  UPDATE Transactions T
  INNER JOIN Users U ON U.idUser = T.idUser
  SET T.statut = ?
  WHERE U.pseudo = ? AND T.statut = ?;

  
  `;

  try {
    const [results] = await db.query(query, [
      "Cancelled",
      userSpeudo,
      "Opened"
    ]);

    return { success: true, message: "Ordres supprimés avec succès." };
  } catch (error) {
    console.error("Erreur lors de suppresion des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}


async function getAllOrdersBuy(tradedPair) {
  const query = `
    SELECT dateTrans, pair, direction, price, amount, total FROM Transactions T
    WHERE T.statut = 'Executed' AND T.direction = 'buy' AND T.pair = ?
    ORDER BY dateTrans DESC LIMIT 8;
  `;

  try {
    const [results] = await db.query(query,[tradedPair]);

    return { success: true, data:results, message: "Ordres exécuté 'buy' récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

async function getAllOrdersSell(tradedPair) {

  const query = `
    SELECT dateTrans, pair, direction, price, amount, total FROM Transactions T
    WHERE T.statut = 'Executed' AND T.direction = 'sell' AND T.pair = ?
    ORDER BY dateTrans DESC LIMIT 8;
  `;

  try {
    const [results] = await db.query(query,[tradedPair]);

    return { success: true, data:results, message: "Ordres exécuté 'sell' récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

async function calcStandardDeviation(tradedPair) {
  // Requête SQL pour récupérer les prix historiques de la paire pour la dernière minute
  const queryHistoriquePrix = `
    SELECT currentPrice
    FROM PricesHistory
    INNER JOIN Pairs ON PricesHistory.idPair = Pairs.idPair
    WHERE Pairs.namePair = ?
    AND datePrice BETWEEN NOW() - INTERVAL 1 MINUTE AND NOW();
  `;

  try {
    // Exécution de la requête
    const [historiquePrix] = await db.query(queryHistoriquePrix, [tradedPair]);

    // Extraire les prix dans un tableau
    const prix = historiquePrix.map(row => row.currentPrice);

    if (prix.length < 2) {
      // Pas assez de données pour calculer une variance ou un écart type significatif
      throw new Error("Pas assez de données pour calculer l'écart type.");
    }

    // Calcul de la moyenne des prix
    const moyenne = prix.reduce((acc, val) => acc + val, 0) / prix.length;

    // Calcul de l'écart type
    const variance = prix.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / (prix.length - 1); // Utilisation de n-1 pour un échantillon
    const ecartType = Math.sqrt(variance);

    return ecartType;
  } catch (error) {
    console.error("Erreur lors du calcul de l'écart type pour la paire :", error);
    // Gérer l'erreur de manière appropriée
    return 0; // Ou une autre valeur par défaut qui indique une erreur ou une absence de variance
  }
}

function determineFactor(tokenPrice) {
  if (tokenPrice < 100) {
      return 0.2;
  } else if (tokenPrice >= 100 && tokenPrice < 1000) {
      return 0.5;
  } else {
      return 0.05;
  }
}

async function ExecuteOpenedOrderByPair(tradedPair, tokenPrice) {
  // Calcule l'écart type pour la paire tradée
  const ecartType = await calcStandardDeviation(tradedPair);

  // Détermine le facteur en fonction du prix du token
  const facteur = determineFactor(tokenPrice);

  // Calcule les bornes inférieure et supérieure en fonction de l'écart type
  const lowerBound = tokenPrice - (ecartType * facteur);
  const upperBound = tokenPrice + (ecartType * facteur);
  
  const selectQuery = `
    SELECT T.idTrans, T.idUser, U.userToken, T.dateTrans, T.pair, T.direction, T.price, T.amount, T.total FROM Transactions T
    INNER JOIN Users U ON U.idUser = T.idUser
    WHERE T.statut = 'Opened'
    AND T.pair = ?
    AND T.price BETWEEN ? AND ?
    ORDER BY T.dateTrans DESC;
  `;

  try {
    const [selectedOrders] = await db.query(selectQuery, [
      tradedPair,
      lowerBound,  // Pour la borne inférieure calculée
      upperBound,  // Pour la borne supérieure calculée
    ]);

    if (selectedOrders.length > 0) {
      const idsToUpdate = selectedOrders.map(order => order.idTrans);

      const updateQuery = `
        UPDATE Transactions
        SET statut = 'Executed'
        WHERE idTrans IN (?);
      `;
      await db.query(updateQuery, [idsToUpdate]);

      return { success: true, data: selectedOrders, message: "Ordres 'Executed' mis à jour avec succès." };
    } else {
      return { success: true, data: [], message: "Aucun ordre correspondant trouvé." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération ou la mise à jour des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}






module.exports = { addNewTransaction, getUserOpenedOrder, getUserOrderHistory, deleteTransation, deleteAllUserTransation, getAllOrdersBuy, getAllOrdersSell, ExecuteOpenedOrderByPair };