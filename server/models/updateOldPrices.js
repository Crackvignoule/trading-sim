const { connectToDatabase } = require('../database');
const axios = require('axios');

const selectLastDate = async (db, namePair) => {
  const result = await db.collection('PricesHistory').find({ namePair }).sort({ datePrice: -1 }).limit(1).toArray();
  return result.length ? result[0].datePrice : null;
};

const selectAllPair = async (db) => {
  const results = await db.collection('Pairs').find({ namePair: { $ne: 'USDT/USDT' } }).toArray();
  return results;
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const updateOldPrices = async () => {
  const db = await connectToDatabase();
  const pairs = await selectAllPair(db);

  for (let pair of pairs) {
    let namePair = pair.namePair;

    // let lastDate = await selectLastDate(db, namePair);
    // let startTime = lastDate ? new Date(lastDate).getTime() : 0;
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

          const existingPair = await db.collection('Pairs').findOne({ namePair });
          const idPair = existingPair ? existingPair._id : null;

          const filter = { idPair, datePrice };
          const update = {
            $set: {
              currentPrice: parseFloat(close),
              lowestPrice: parseFloat(low),
              highestPrice: parseFloat(high),
              volume: parseFloat(volume),
            }
          };
          const options = { upsert: true };

          await db.collection('PricesHistory').updateOne(filter, update, options);
        }

        let lastKline = klines[klines.length - 1];
        startTime = new Date(lastKline[0]).getTime() + 3600000; // 3600000 = 1h

        // await delay(1000); // If needed, add a delay to avoid spamming the API
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'API Binance:", error);
        break;
      }
    }
  }
  await deleteDuplicateEntries(db);
};

const deleteDuplicateEntries = async (db) => {
  try {
    const duplicates = await db.collection('PricesHistory').aggregate([
      {
        $group: {
          _id: { datePrice: "$datePrice", idPair: "$idPair" },
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    for (let duplicate of duplicates) {
      const idsToRemove = duplicate.ids.slice(1);
      await db.collection('PricesHistory').deleteMany({ _id: { $in: idsToRemove } });
    }

    console.log(`${duplicates.length} doublons supprimés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de la suppression des doublons:", error);
  }
};

module.exports = { updateOldPrices };
