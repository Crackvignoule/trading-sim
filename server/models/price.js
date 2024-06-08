const { connectToDatabase } = require('../database');

async function getLastPriceByPair(tradedPair) {
    try {
        // Connect to the database
        const db = await connectToDatabase();
        
        // MongoDB query to find the last price by pair
        const PriceHistory = db.collection('PriceHistory'); // Assuming the collection name is PriceHistory
        const lastPrice = await PriceHistory.findOne({ pair: tradedPair })
            .sort({ datePrice: -1 }) // Sort by datePrice descending to get the latest entry
        
        // Check if there's a result
        if (lastPrice) {
            return { success: true, data: lastPrice };
        } else {
            return { success: false, message: "Aucune donnée trouvée" };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return { success: false, message: "Erreur lors de la récupération des données." };
    }
}

module.exports = { getLastPriceByPair };
