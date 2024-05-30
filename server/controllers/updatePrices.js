const { updateTokenPrices } = require('../models/updatePrices');
const { ExecuteOpenedOrderByPair } = require('../models/transaction');
const { ws, broadcastDataPair } = require('../services/serverWebSocket');
const { ws2, broadcastOrders } = require('../services/serverWebSocket');
const { sendToUser, sendToUserSolde, getClientTokens } = require('../services/serverWebSocket');
const { getAllUserSolde, setUserWalletHistory } = require('../models/userWallets');

const postData = async (ticker, pair) => {

    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c) //ticker.c est le prix 'current' de la pair
    };
    broadcastDataPair(pair,data,ws); //Partager le prix à tout les clients connectés
    await updateTokenPrices(ticker,pair);
    const ExecuteOrders = await ExecuteOpenedOrderByPair(pair,parseFloat(ticker.c)); //récupérer tout les ordres ouverts au prix actuel
    if (ExecuteOrders.data.length > 0){
        ExecuteOrders.data.forEach(order => {
            sendToUser(order.userToken,order); // Envoi les données à l'utilisateur concerné
            
        });

       // Crée une nouvelle version de chaque ordre sans l'attribut userToken
        const ordersToBroadcast = ExecuteOrders.data.map(({ userToken, ...orderWithoutToken }) => orderWithoutToken);
        
        // Envoie les ordres à tout le monde sans le userToken
        broadcastOrders(ordersToBroadcast, ws2);
    }

    //récupère les soldes de tout les utilisateurs
    const clientTokens = getClientTokens();
    getAllUserSolde(clientTokens).then(response => {
        if (response.success) {
            
            response.data.forEach(user => {
                sendToUserSolde(user.userToken, user.userSolde); // Envoi le solde à chaque utilisateur

            // Update the WalletsHistory table
            
            setUserWalletHistory(user.userToken, user.userSolde).catch(error => {
                console.error("Error updating WalletsHistory:", error);
            });

            });
        } else {
            console.error(response.message);
        }
    }).catch(error => {
        console.error("Erreur lors de la récupération des soldes des utilisateurs :", error);
    });
};

module.exports = { postData };