const db = require('../database');

const updatePricesBDTUSDT = (ticker) => {
  return new Promise((resolve, reject) => {

    let datePriceTimeStamp = ticker.E !== undefined ? ticker.E : null;
    let currentPrice = ticker.c !== undefined ? parseFloat(ticker.c) : null;
    let lowestPrice = ticker.l !== undefined ? parseFloat(ticker.l) : null;
    let highestPrice = ticker.h !== undefined ? parseFloat(ticker.h) : null;
    let volume = ticker.v !== undefined ? parseFloat(ticker.v) : null;

    let datePrice = new Date(datePriceTimeStamp);
    let formattedDatePrice = datePrice.toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO PricesHistory (idPair, currentPrice, lowestPrice, highestPrice, volume, datePrice) \
    SELECT idPair, ?, ?, ?, ?, ? \
    FROM Pairs \
    WHERE namePair = ?';

    db.execute(query, [currentPrice,lowestPrice,highestPrice,volume,formattedDatePrice,"BTC/USDT"], (error, results) => {
      if (error) {
        reject(error);
      } else {
          resolve(results);
      }
    });
  });
};

module.exports = { updatePricesBDTUSDT };
