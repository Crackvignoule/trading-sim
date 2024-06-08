const { connectToDatabase } = require('../database');

async function getTokenAmountByUser(pseudo, tokenName) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsCollection = db.collection('Wallets');

        const user = await usersCollection.findOne({ pseudo: pseudo });
        if (!user) {
            return { success: false, message: "User not found." };
        }

        const wallet = await walletsCollection.findOne({ idUser: user._id, tokenName: tokenName });
        if (wallet) {
            return { success: true, data: wallet };
        } else {
            return { success: false, message: "No data found for this user and token." };
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return { success: false, message: "Error fetching data." };
    }
}

async function setUserWallet(amountBuyToken, amountSellToken, priceBuyToken, tradedPair, userPseudo, action, mode) {
    let session;
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsCollection = db.collection('Wallets');

        session = db.startSession();
        session.startTransaction();

        const user = await usersCollection.findOne({ pseudo: userPseudo });
        if (!user) {
            throw new Error("User not found.");
        }

        const token1 = tradedPair.split("/")[0];
        const token2 = tradedPair.split("/")[1];
        let buyTokenName = action === "buy" ? token1 : token2;
        let sellTokenName = action === "buy" ? token2 : token1;

        if (mode === "market") {
            await walletsCollection.updateOne(
                { idUser: user._id, tokenName: buyTokenName },
                { $inc: { amount: amountBuyToken } },
                { session }
            );

            await walletsCollection.updateOne(
                { idUser: user._id, tokenName: sellTokenName },
                { $inc: { amount: -amountSellToken } },
                { session }
            );

            await session.commitTransaction();
            return { success: true, message: "Update successful." };
        } else {
            // Handle other modes...
            return { success: false, message: "Mode not supported." };
        }
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error("Error during transaction:", error);
        return { success: false, message: "Error updating data." };
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

async function getUserSolde(userToken) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsCollection = db.collection('Wallets');
        const pricesHistoryCollection = db.collection('PricesHistory');
        const pairsCollection = db.collection('Pairs');

        const user = await usersCollection.findOne({ userToken: userToken });
        if (!user) {
            return { success: false, message: "User not found." };
        }

        const wallets = await walletsCollection.find({ idUser: user._id }).toArray();
        let userSolde = 0;

        for (const wallet of wallets) {
            if (wallet.tokenName === "USDT") {
                userSolde += wallet.amount;
            } else {
                const pair = await pairsCollection.findOne({ namePair: wallet.tokenName + "/USDT" });
                if (pair) {
                    const priceHistory = await pricesHistoryCollection.findOne(
                        { idPair: pair._id },
                        { sort: { datePrice: -1 } }
                    );
                    if (priceHistory) {
                        userSolde += priceHistory.currentPrice * wallet.amount;
                    }
                }
            }
        }

        userSolde = userSolde.toFixed(4);
        return { success: true, data: userSolde };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { success: false, message: "Error fetching data." };
    }
}

async function getAllUserSolde(clientsSoldeToken) {
    if (Object.keys(clientsSoldeToken).length !== 0) {
        try {
            const db = await connectToDatabase();
            const usersCollection = db.collection('Users');
            const walletsCollection = db.collection('Wallets');
            const pricesHistoryCollection = db.collection('PricesHistory');
            const pairsCollection = db.collection('Pairs');

            const users = await usersCollection.find({ userToken: { $in: clientsSoldeToken } }).toArray();
            let userSoldes = {};

            const prices = await pricesHistoryCollection.aggregate([
                {
                    $group: {
                        _id: "$idPair",
                        currentPrice: { $last: "$currentPrice" }
                    }
                }
            ]).toArray();

            let pricesObj = {};
            for (const price of prices) {
                const pair = await pairsCollection.findOne({ _id: price._id });
                if (pair) {
                    pricesObj[pair.namePair] = price.currentPrice;
                }
            }

            for (const user of users) {
                const wallets = await walletsCollection.find({ idUser: user._id }).toArray();
                userSoldes[user.userToken] = 0;

                for (const wallet of wallets) {
                    if (wallet.tokenName === "USDT") {
                        userSoldes[user.userToken] += wallet.amount;
                    } else {
                        const namePair = wallet.tokenName + "/USDT";
                        userSoldes[user.userToken] += pricesObj[namePair] * wallet.amount;
                    }
                }

                userSoldes[user.userToken] = userSoldes[user.userToken].toFixed(2);
            }

            const userSoldesArray = Object.keys(userSoldes).map(userToken => ({
                userToken: userToken,
                userSolde: userSoldes[userToken]
            }));

            return { success: true, data: userSoldesArray };
        } catch (error) {
            console.error("Error fetching data:", error);
            return { success: false, message: "Error fetching data." };
        }
    } else {
        return { success: false };
    }
}

async function setUserWalletHistory(userToken, userSolde) {
    const dateWallet = new Date();
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsHistoryCollection = db.collection('WalletsHistory');

        const user = await usersCollection.findOne({ userToken: userToken });
        if (!user) {
            throw new Error("User not found.");
        }

        await walletsHistoryCollection.insertOne({
            idUser: user._id,
            total: userSolde,
            dateWallet: dateWallet
        });
    } catch (error) {
        console.error("Error updating WalletsHistory:", error);
        throw error;
    }
}

async function getRanking() {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsHistoryCollection = db.collection('WalletsHistory');

        const results = await walletsHistoryCollection.aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: "$idUser",
                    latestTotal: { $last: "$total" },
                    latestDate: { $last: "$dateWallet" },
                    firstDate: { $first: "$dateWallet" },
                    max24hTotal: { $max: { $cond: [ { $gte: [ "$dateWallet", { $subtract: [ "$latestDate", 24 * 60 * 60 * 1000 ] } ] }, "$total", null ] } }
                }
            },
            {
                $project: {
                    idUser: "$_id",
                    latestTotal: 1,
                    evolution24h: { $subtract: [ "$latestTotal", "$max24hTotal" ] },
                    timePlayedSeconds: { $divide: [ { $subtract: [ "$latestDate", "$firstDate" ] }, 1000 ] }
                }
            },
            {
                $sort: { latestTotal: -1 }
            }
        ]).toArray();

        return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function getUserWalletHistory(userToken) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const walletsHistoryCollection = db.collection('WalletsHistory');

        const user = await usersCollection.findOne({ userToken: userToken });
        if (!user) {
            return { success: false, message: 'No history found for this user' };
        }

        const walletHistory = await walletsHistoryCollection.find({ idUser: user._id }).toArray();
        return { success: true, data: walletHistory };
    } catch (error) {
        console.error('Error fetching user wallet history:', error);
        return { success: false, message: 'Error fetching data' };
    }
}

async function setUserData(userToken, data) {
    const dateUser = new Date();
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');
        const usersDataCollection = db.collection('UsersData');

        const user = await usersCollection.findOne({ userToken: userToken });
        if (!user) {
            throw new Error("User not found.");
        }

        await usersDataCollection.insertOne({
            idUser: user._id,
            data: data,
            dateUser: dateUser
        });
    } catch (error) {
        console.error("Error updating UsersData:", error);
        throw error;
    }
}

async function getAllClientTokens() {
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('Users');
  
      const users = await usersCollection.find({}, { projection: { userToken: 1, _id: 0 } }).toArray();
      return users.map(user => user.userToken);
  
    } catch (error) {
      console.error("Error getting all client tokens:", error);
        return [];
    }
}

module.exports = {
    getTokenAmountByUser,
    setUserWallet,
    getUserSolde,
    getAllUserSolde,
    setUserWalletHistory,
    getRanking,
    getAllClientTokens,
    getUserWalletHistory,
    setUserData
};
