const { connectToDatabase } = require("../database");
const moment = require('moment');

async function addNewTransaction(userPseudo, tradedPair, tokenPrice, amountToken, total, typeTransaction, direction, statut) {
    let dateTransaction = new Date();

    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Insert new transaction into MongoDB
        const Transactions = db.collection('Transactions');
        const insertedTransaction = await Transactions.insertOne({
            idUser: userPseudo, // Assuming idUser is userPseudo in MongoDB
            pair: tradedPair,
            price: tokenPrice,
            amount: amountToken,
            total: total,
            dateTrans: dateTransaction,
            type: typeTransaction,
            direction: direction,
            statut: statut
        });

        const dateTransFormatted = moment(dateTransaction).format('YYYY-MM-DD HH:mm:ss');
        const data = {
            date: dateTransFormatted,
            pair: tradedPair,
            type: typeTransaction,
            direction: direction,
            price: tokenPrice,
            amount: amountToken,
            total: total,
            idTrans: insertedTransaction.insertedId, // Get the inserted ID
            statut: statut
        };

        return { success: true, data: data, message: "Transaction ajoutée avec succès." };
    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function getUserOpenedOrder(userSpeudo) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Find user's opened orders from MongoDB
        const Transactions = db.collection('Transactions');
        const results = await Transactions.find({ idUser: userSpeudo, statut: 'Opened' }).toArray();

        const formattedResults = results.map(transaction => ({
            ...transaction,
            dateTrans: moment(transaction.dateTrans).format('YYYY-MM-DD HH:mm:ss')
        }));

        return { success: true, data: formattedResults, message: "Ordres ouverts récupérés avec succès." };
    } catch (error) {
        console.error("Erreur de la récupération des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function getUserOrderHistory(userSpeudo) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Find user's order history from MongoDB
        const Transactions = db.collection('Transactions');
        const results = await Transactions.find({ idUser: userSpeudo, statut: { $in: ['Executed', 'Cancelled'] } }).toArray();

        const formattedResults = results.map(transaction => ({
            ...transaction,
            dateTrans: moment(transaction.dateTrans).format('YYYY-MM-DD HH:mm:ss')
        }));

        return { success: true, data: formattedResults, message: "Historique des ordres récupéré avec succès." };
    } catch (error) {
        console.error("Erreur de la récupération des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function deleteTransation(idTrans) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Delete transaction by ID from MongoDB
        const Transactions = db.collection('Transactions');
        const result = await Transactions.deleteOne({ _id: idTrans });

        if (result.deletedCount === 1) {
            return { success: true, message: "Ordre supprimé avec succès." };
        } else {
            return { success: false, message: "Ordre non trouvé ou déjà supprimé." };
        }
    } catch (error) {
        console.error("Erreur lors de suppression de l'ordre :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function deleteAllUserTransation(userSpeudo) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Delete all transactions for a user from MongoDB
        const Transactions = db.collection('Transactions');
        await Transactions.deleteMany({ idUser: userSpeudo, statut: 'Opened' });

        return { success: true, message: "Ordres supprimés avec succès." };
    } catch (error) {
        console.error("Erreur lors de la suppression des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function getAllOrdersBuy(tradedPair) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Find all buy orders for a pair from MongoDB
        const Transactions = db.collection('Transactions');
        const results = await Transactions.find({
            pair: tradedPair,
            statut: 'Executed',
            direction: 'buy'
        }).sort({ dateTrans: -1 }).limit(8).toArray();

        return { success: true, data: results, message: "Ordres exécutés 'buy' récupérés avec succès." };
    } catch (error) {
        console.error("Erreur de la récupération des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function getAllOrdersSell(tradedPair) {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Find all sell orders for a pair from MongoDB
        const Transactions = db.collection('Transactions');
        const results = await Transactions.find({
            pair: tradedPair,
            statut: 'Executed',
            direction: 'sell'
        }).sort({ dateTrans: -1 }).limit(8).toArray();

        return { success: true, data: results, message: "Ordres exécutés 'sell' récupérés avec succès." };
    } catch (error) {
        console.error("Erreur de la récupération des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

async function calcStandardDeviation(tradedPair) {
    try {
        // Implement your logic to calculate standard deviation from MongoDB
        // Assuming you have PriceHistory collection with historical prices
        const db = await connectToDatabase();
        const PriceHistory = db.collection('PriceHistory');
        const prices = await PriceHistory.find({
            pair: tradedPair,
            datePrice: { $gte: new Date(Date.now() - 60000) } // Last minute prices
        }).toArray();

        const prix = prices.map(price => price.currentPrice);
        if (prix.length < 2) {
            throw new Error("Pas assez de données pour calculer l'écart type.");
        }

        const moyenne = prix.reduce((acc, val) => acc + val, 0) / prix.length;
        const variance = prix.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / (prix.length - 1);
        const ecartType = Math.sqrt(variance);

        return ecartType;
    } catch (error) {
        console.error("Erreur lors du calcul de l'écart type pour la paire :", error);
        return 0;
    }
}

function determineFactor(tokenPrice) {
    if (tokenPrice < 100) {
        return 0.2;
    } else if (tokenPrice >= 100 && tokenPrice < 1000) {
        return 0.5;
    } else {
        return 0.05;
    }
}

async function ExecuteOpenedOrderByPair(tradedPair, tokenPrice) {
    const ecartType = await calcStandardDeviation(tradedPair);
    const facteur = determineFactor(tokenPrice);
    const lowerBound = tokenPrice - (ecartType * facteur);
    const upperBound = tokenPrice + (ecartType * facteur);

    try {
        const db = await connectToDatabase();
        const Transactions = db.collection('Transactions');
        const selectedOrders = await Transactions.find({
            pair: tradedPair,
            statut: 'Opened',
            price: { $gte: lowerBound, $lte: upperBound }
        }).toArray();

        if (selectedOrders.length > 0) {
            const idsToUpdate = selectedOrders.map(order => order._id);

            await Transactions.updateMany(
                { _id: { $in: idsToUpdate } },
                { $set: { statut: 'Executed' } }
            );

            return { success: true, data: selectedOrders, message: "Ordres 'Executed' mis à jour avec succès." };
        } else {
            return { success: true, data: [], message: "Aucun ordre correspondant trouvé." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération ou la mise à jour des ordres :", error);
        return { success: false, message: "Erreur lors de l'exécution de la requête." };
    }
}

module.exports = {
    addNewTransaction,
    getUserOpenedOrder,
    getUserOrderHistory,
    deleteTransation,
    deleteAllUserTransation,
    getAllOrdersBuy,
    getAllOrdersSell,
    ExecuteOpenedOrderByPair
};