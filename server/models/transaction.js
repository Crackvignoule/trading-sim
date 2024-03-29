const db = require("../database");


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
      return { success: true, message: "Transaction ajoutée avec succès." };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction :", error);
      return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
  }
  

module.exports = { addNewTransaction };