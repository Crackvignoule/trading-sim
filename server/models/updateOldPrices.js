const db = require('../database');
const axios = require('axios');
const moment = require('moment');

// const updatePricesBDTUSDT = (ticker) => {
//   return new Promise((resolve, reject) => {

//     let datePriceTimeStamp = ticker.E !== undefined ? ticker.E : null;
//     let currentPrice = ticker.c !== undefined ? parseFloat(ticker.c) : null;
//     let lowestPrice = ticker.l !== undefined ? parseFloat(ticker.l) : null;
//     let highestPrice = ticker.h !== undefined ? parseFloat(ticker.h) : null;
//     let volume = ticker.v !== undefined ? parseFloat(ticker.v) : null;

//     let datePrice = new Date(datePriceTimeStamp);
//     let formattedDatePrice = datePrice.toISOString().slice(0, 19).replace('T', ' ');

//     const query = `
//       INSERT INTO PricesHistory (idPair, currentPrice, lowestPrice, highestPrice, volume, datePrice)
//       SELECT p.idPair, ?, ?, ?, ?, ?
//       FROM Pairs p
//       WHERE p.namePair = ?
//       AND NOT EXISTS (
//           SELECT 1
//           FROM PricesHistory ph
//           WHERE ph.datePrice = ? AND ph.idPair = p.idPair
//       );
//       `;


//     db.execute(query, [currentPrice,lowestPrice,highestPrice,volume,formattedDatePrice,"BTC/USDT",formattedDatePrice], (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//           resolve(results);
//       }
//     });
//   });
// };

// module.exports = { updatePricesBDTUSDT };








// // Create a MySQL connection pool (replace with your own database credentials)
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'binance',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const symbol = 'BTCUSDT';
// const interval = '1s';

// async function updateDatabase() {
//   // Get the latest kline from the database
//   const [rows] = await pool.query('SELECT * FROM klines ORDER BY openTime DESC LIMIT 1');
//   const latestKline = rows[0];

  let startTime;
  if (latestKline) {
    startTime = latestKline.closeTime + 1;  // start from the end of the latest kline in the database
  } else {
    startTime = moment('1 Jan, 2017', 'D MMM, YYYY').valueOf();  // if the database is empty, start from this date
  }
  const endTime = moment().valueOf();

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

//   const response = await axios.get(url);
//   const data = response.data;

//   for (let kline of data) {
//     const [openTime, open, high, low, close, volume, closeTime, quoteAssetVolume, numberOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume, ignore] = kline;

//     // Insert the kline into the database
//     await pool.query(
//       'INSERT INTO klines (openTime, open, high, low, close, volume, closeTime, quoteAssetVolume, numberOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume, ignore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [openTime, open, high, low, close, volume, closeTime, quoteAssetVolume, numberOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume, ignore]
//     );
//   }
// }

// export default updateDatabase;