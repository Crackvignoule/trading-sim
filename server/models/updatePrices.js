const db = require("../database");

const updateTokenPrices = async (ticker, pairName) => {
  let attempts = 0;
  const maxAttempts = 5;

  let datePriceTimeStamp = ticker.E !== undefined ? ticker.E : null;
  let currentPrice = ticker.c !== undefined ? parseFloat(ticker.c) : null;
  let lowestPrice = ticker.l !== undefined ? parseFloat(ticker.l) : null;
  let highestPrice = ticker.h !== undefined ? parseFloat(ticker.h) : null;
  let volume = ticker.v !== undefined ? parseFloat(ticker.v) : null;

  let datePrice = new Date(datePriceTimeStamp);
  let formattedDatePrice = datePrice.toISOString().slice(0, 19).replace("T", " ");

  const query = `
    INSERT INTO PricesHistory (idPair, currentPrice, lowestPrice, highestPrice, volume, datePrice)
    SELECT p.idPair, ?, ?, ?, ?, ?
    FROM Pairs p
    WHERE p.namePair = ?
    AND NOT EXISTS (
        SELECT 1
        FROM PricesHistory ph
        WHERE ph.datePrice = ? AND ph.idPair = p.idPair
    );
  `;

  while (attempts < maxAttempts) {
    try {
      const [results] = await db.execute(query, [
        currentPrice,
        lowestPrice,
        highestPrice,
        volume,
        formattedDatePrice,
        pairName,
        formattedDatePrice,
      ]);

      return results; // La mise à jour a réussi, retourne le résultat
    } catch (error) {
      if (error.code === 'ER_LOCK_DEADLOCK') {
        // Si l'erreur est un deadlock, réessayer après une courte pause
        console.log(`Deadlock detected on attempt ${attempts + 1}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde avant de réessayer
        attempts++;
      } else {
        // Pour toute autre erreur, la rejeter immédiatement
        throw error;
      }
    }
  }

  // Si le code atteint ce point, cela signifie que toutes les tentatives ont échoué
  throw new Error('Failed to update token prices after several attempts due to deadlocks.');
};

module.exports = { updateTokenPrices };
