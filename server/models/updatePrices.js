const { connectToDatabase } = require('../database');

const updateTokenPrices = async (ticker, pairName) => {
  let attempts = 0;
  const maxAttempts = 5;

  let datePriceTimeStamp = ticker.E !== undefined ? ticker.E : null;
  let currentPrice = ticker.c !== undefined ? parseFloat(ticker.c) : null;
  let lowestPrice = ticker.l !== undefined ? parseFloat(ticker.l) : null;
  let highestPrice = ticker.h !== undefined ? parseFloat(ticker.h) : null;
  let volume = ticker.v !== undefined ? parseFloat(ticker.v) : null;

  let datePrice = new Date(datePriceTimeStamp);

  const db = await connectToDatabase();
  const pairsCollection = db.collection('Pairs');
  const pricesHistoryCollection = db.collection('PricesHistory');

  while (attempts < maxAttempts) {
    try {
      const pair = await pairsCollection.findOne({ namePair: pairName });
      if (!pair) {
        throw new Error(`Pair ${pairName} not found`);
      }

      const existingEntry = await pricesHistoryCollection.findOne({
        datePrice: datePrice,
        idPair: pair._id
      });

      if (!existingEntry) {
        await pricesHistoryCollection.insertOne({
          idPair: pair._id,
          currentPrice,
          lowestPrice,
          highestPrice,
          volume,
          datePrice
        });
      }

      return { success: true }; // Return success if the update succeeded
    } catch (error) {
      if (error.code === 112) { // MongoDB's equivalent of deadlock (e.g., write conflict)
        console.log(`Write conflict detected on attempt ${attempts + 1}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        attempts++;
      } else {
        // For any other error, reject immediately
        throw error;
      }
    }
  }

  // If the code reaches this point, it means all attempts have failed
  throw new Error('Failed to update token prices after several attempts due to write conflicts.');
};

module.exports = { updateTokenPrices };
