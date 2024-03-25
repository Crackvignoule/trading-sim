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
  

module.exports = { getTokenAmountByUser };