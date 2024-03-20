const db = require('../database');

const selectDataBTCUSDT = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT datePrice as time, currentPrice as value \
    FROM PricesHistory ph \
    INNER JOIN Pairs p ON p.idPair = ph.idPair \
    WHERE p.namePair = ? AND datePrice IS NOT NULL AND currentPrice IS NOT NULL \
    ORDER BY datePrice';
    db.execute(query, ["BTC/USDT"], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const formattedResults = results.map(row => ({
          // Convertir l'objet Date en timestamp en secondes
          time: Math.floor(new Date(row.time).getTime() / 1000),
          value : row.value
      }));
      console.log(formattedResults);
      resolve(formattedResults);
      }
    });
  });
};

module.exports = { selectDataBTCUSDT };
