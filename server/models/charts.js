const db = require('../database');

const selectDataBTCUSDT = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT datePrice as time, price as value FROM PricesHistory ph INNER JOIN Pairs p ON p.idPair = ph.idPair WHERE p.namePair = ? ORDER BY datePrice';
    db.execute(query, ["BTC/USDT"], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const formattedResults = results.map(row => ({
            ...row,
            time: row.time.toISOString().split('T')[0],
            value : parseFloat(row.value.toFixed(2))
          }));
          resolve(formattedResults);
      }
    });
  });
};

module.exports = { selectDataBTCUSDT };
