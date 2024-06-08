const { connectToDatabase } = require("../database");

async function selectDataBTCUSDT() {
    try {
        const db = await connectToDatabase();

        const PricesHistory = db.collection('PricesHistory');
        const Pairs = db.collection('Pairs');

        const btcUsdtPair = await Pairs.findOne({ namePair: "BTC/USDT" });

        if (!btcUsdtPair) {
            return { success: false, message: "Aucun Résulats" };
        }

        const query = [
            {
                $match: {
                    idPair: btcUsdtPair._id,
                    datePrice: { $ne: null },
                    currentPrice: { $ne: null }
                }
            },
            {
                $project: {
                    time: { $toInt: { $divide: [{ $toLong: "$datePrice" }, 1000] } },
                    value: "$currentPrice",
                    _id: 0
                }
            },
            {
                $sort: { time: 1 }
            }
        ];

        const cursor = await PricesHistory.aggregate(query);

        const formattedResults = await cursor.toArray();

        if (formattedResults.length > 0) {
            return { success: true, result: formattedResults };
        } else {
            return { success: false, message: "Aucun Résulats" };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return { success: false, message: "Erreur lors de la récupération des données." };
    }
}

module.exports = { selectDataBTCUSDT };
