const db = require("../database");


async function getTokenAmountByUser(tradedPair) {
    try {
      // Construisez votre requête SQL pour joindre les tables Users et Wallets
      const query = `
        SELECT currentPrice, datePrice FROM PricesHistory PH
        INNER JOIN Pairs P ON P.idPair = PH.idPair
        WHERE P.namePair = ?
        ORDER BY datePrice DESC
        LIMIT 1;
      `;
      
      // Exécutez la requête avec les paramètres fournis
      const [rows] = await db.query(query, [tradedPair]);
      
      // Vérifiez si nous avons un résultat
      if (rows.length > 0) {
        return { success: true, data: rows[0] };
      } else {
        return { success: false, message: "Aucune donnée trouvée" };
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return { success: false, message: "Erreur lors de la récupération des données." };
    }
  }

module.exports = { getTokenAmountByUser };