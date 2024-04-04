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
  
async function getUserOpenOrder(userSpeudo) {

  const query = `
    SELECT dateTrans, pair, type, direction, price, amount, total, idTrans FROM Transactions T
    INNER JOIN Users U ON U.idUser = T.idUser
    WHERE U.pseudo = ? AND T.statut = 'Open'
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
  WHERE U.pseudo = ?;

  
  `;

  try {
    const [results] = await db.query(query, [
      "Cancelled",
      userSpeudo
    ]);

    return { success: true, message: "Ordres supprimés avec succès." };
  } catch (error) {
    console.error("Erreur lors de suppresion des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}


async function getAllOrdersBuy() {

  const query = `
    SELECT dateTrans, pair, direction, price, amount, total FROM Transactions T
    WHERE T.statut = 'Executed' AND T.direction = 'buy'
    ORDER BY dateTrans DESC LIMIT 8;
  `;

  try {
    const [results] = await db.query(query);

    return { success: true, data:results, message: "Ordres exécuté 'buy' récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

async function getAllOrdersSell() {

  const query = `
    SELECT dateTrans, pair, direction, price, amount, total FROM Transactions T
    WHERE T.statut = 'Executed' AND T.direction = 'sell'
    ORDER BY dateTrans DESC LIMIT 8;
  `;

  try {
    const [results] = await db.query(query);

    return { success: true, data:results, message: "Ordres exécuté 'sell' récupéré avec succès." };
  } catch (error) {
    console.error("Erreur de la récupération des ordres :", error);
    return { success: false, message: "Erreur lors de l'exécution de la requête." };
  }
}

module.exports = { addNewTransaction, getUserOpenOrder, getUserOrderHistory, deleteTransation, deleteAllUserTransation, getAllOrdersBuy, getAllOrdersSell };