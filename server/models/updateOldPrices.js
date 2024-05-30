const db = require("../database");
const axios = require("axios");

const selectLastDate = (namePair) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT DatePrice FROM PricesHistory ph
      INNER JOIN Pairs p ON p.idPair = ph.idPair
      WHERE p.namePair = ? ORDER BY DatePrice DESC LIMIT 1
    `;
    db.execute(query, [namePair])
      .then(([results]) => {
        resolve(results[0]?.DatePrice);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const selectAllPair = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT namePair FROM Pairs WHERE namePair != 'USDT/USDT'`;
    db.execute(query)
      .then(([results]) => {
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const updateOldPrices = async () => {
  let pairs = await selectAllPair();

  for (let pair of pairs) {
    let namePair = pair.namePair;

    //let lastDate = await selectLastDate(namePair);
    //let startTime = lastDate ? new Date(lastDate).getTime() : 0;
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    startDate.setDate(startDate.getDate() - 1);

    let startTime = startDate.getTime();
    let endTime = Date.now();
    let symbol = namePair.replace("/", "");
    console.log("######################");
    console.log("symbol", symbol);
    console.log("######################");
    let interval = "1d";

    while (startTime < endTime) {
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

      try {
        const response = await axios.get(url);
        const klines = response.data;

        if (klines.length === 0) {
          break;
        }

        for (let kline of klines) {
          let [openTime, , high, low, close, volume] = kline;
          let datePrice = new Date(openTime);
          const insertQuery = `
            INSERT INTO PricesHistory (idPair, currentPrice, lowestPrice, highestPrice, volume, datePrice)
            SELECT idPair, ?, ?, ?, ?, ?
            FROM Pairs
            WHERE namePair = ?
            ON DUPLICATE KEY UPDATE currentPrice = VALUES(currentPrice), lowestPrice = VALUES(lowestPrice), highestPrice = VALUES(highestPrice), volume = VALUES(volume);
          `;

          await db.execute(insertQuery, [
            parseFloat(close),
            parseFloat(low),
            parseFloat(high),
            parseFloat(volume),
            datePrice,
            namePair,
          ]);
        }

        // Mise à jour startTime pour la prochaine itération
        let lastKline = klines[klines.length - 1];
        startTime = new Date(lastKline[0]).getTime() + 3600000; // 3600000 = 1h

        //await delay(1000); // Si besoin rajoute un délai pour éviter le spam
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'API Binance:",
          error
        );
        break;
      }
    }
  }
  await deleteDuplicateEntries();
};

const deleteDuplicateEntries = async () => {
  try {
    // Supprimer les doublons en conservant l'entrée avec l'idPrice le plus bas pour chaque datePrice en double
    const deleteQuery = `
      DELETE ph1 FROM PricesHistory ph1
        INNER JOIN (
          SELECT MIN(idPrice) as keepId, datePrice, idPair
          FROM PricesHistory
          GROUP BY datePrice, idPair
          HAVING COUNT(*) > 1
        ) ph2 ON ph1.datePrice = ph2.datePrice
        WHERE ph1.idPrice != ph2.keepId AND ph1.idPair != ph2.idPair;
    `;

    const [result] = await db.execute(deleteQuery);

    if (result.affectedRows > 0) {
      console.log(`${result.affectedRows} doublons supprimés avec succès.`);
    } else {
      console.log("Aucun doublon à supprimer.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression des doublons:", error);
  }
};

module.exports = { updateOldPrices };
