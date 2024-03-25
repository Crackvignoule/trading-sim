const db = require("../database");

async function selectDataBTCUSDT() {

  try {
    const query =
      "SELECT DISTINCT datePrice as time, currentPrice as value \
      FROM PricesHistory ph \
      INNER JOIN Pairs p ON p.idPair = ph.idPair \
      WHERE p.namePair = ? AND datePrice IS NOT NULL AND currentPrice IS NOT NULL \
      ORDER BY datePrice";
    const [rows] = await db.execute(query, ["BTC/USDT"]);
    if (rows.length > 0) {
      const formattedResults = rows.map((row) => ({
        // Convertir l'objet Date en timestamp en secondes
        time: Math.floor(new Date(row.time).getTime() / 1000),
        value: row.value,
      }));
      return { success: true, result:formattedResults };
    }else{
      return { success: false, message:"Aucun Résulats" };
    }
  }
  catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return { success: false, message: "Erreur lors de la connexion." };
  }
    
      
};

module.exports = { selectDataBTCUSDT };
