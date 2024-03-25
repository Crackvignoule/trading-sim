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


  async function setUserWallet(amountToken, tokenValue, tradedPair, userPseudo, action, mode) {
    try {

      const token1 = tradedPair.split("/")[0];
      const token2 = tradedPair.split("/")[1];
      let buyToken ='';
      let sellToken = '';
      if(action == "buy"){
        buyToken = token1;
        sellToken = token2;
      }else if (action == "sell"){
        buyToken = token2;
        sellToken = token1;
      }

      if(mode == "market"){
        const query = `
        UPDATE Wallets W SET amount = amount + ?
        WHERE idUser IN (SELECT idUser FROM Users WHERE pseudo = ?) 
        AND tokenName = ?;

        UPDATE Wallets W SET amount = amount - ?
        WHERE idUser IN (SELECT idUser FROM Users WHERE pseudo = ?) 
        AND tokenName = ?;
        `;
        const [results, fields]  = await db.query(query, [amountToken,userPseudo,buyToken,tokenValue,userPseudo,sellToken]);

        if (results && results.affectedRows > 0) {
          return { success: true, message: "Mise à jour réussie." };
        } else {
          return { success: false, message: "Aucune mise à jour effectuée." };
        }

      }

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return { success: false, message: "Erreur lors de la récupération des données." };
    }
  }
  

module.exports = { getTokenAmountByUser, setUserWallet };