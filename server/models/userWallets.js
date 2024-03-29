const db = require("../database");

async function getTokenAmountByUser(pseudo, tokenName) {
    try {
      // Construisez votre requête SQL pour joindre les tables Users et Wallets
      const query = `
        SELECT W.tokenName, W.amount
        FROM Wallets W
        JOIN Users U ON W.idUser = U.idUser
        WHERE U.pseudo = ? AND W.tokenName = ?
      `;
      
      // Exécutez la requête avec les paramètres fournis
      const [rows] = await db.query(query, [pseudo, tokenName]);
      
      // Vérifiez si nous avons un résultat
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
  
  

module.exports = { getTokenAmountByUser, setUserWallet };