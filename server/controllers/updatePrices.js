const { updateTokenPrices } = require('../models/updatePrices');
const { ExecuteOpenedOrderByPair } = require('../models/transaction');
const { wss, broadcastDataPair } = require('../services/serverWebSocket');
const { wss2, broadcastOrders } = require('../services/serverWebSocket');

const postDataBTCUSDT = async (ticker) => {
    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c) //ticker.c est le prix 'current' de la pair
    };
    broadcastDataPair("BTC/USDT",data,wss); //Partager le prix à tout les clients connectés
    await updateTokenPrices(ticker,"BTC/USDT");
    const ExecuteOrders = await ExecuteOpenedOrderByPair("BTC/USDT",parseFloat(ticker.c)); //récupérer tout les ordres ouverts au prix actuel
    if (ExecuteOrders.data.length > 0){
        broadcastOrders(ExecuteOrders.data, wss2);
    }
    
};
const postDataETHUSDT = async (ticker) => {

    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c) //ticker.c est le prix 'current' de la pair
    };
    broadcastDataPair("ETH/USDT",data,wss); //Partager le prix à tout les clients connectés
    await updateTokenPrices(ticker,"ETH/USDT");
    const ExecuteOrders = await ExecuteOpenedOrderByPair("ETH/USDT",parseFloat(ticker.c)); //récupérer tout les ordres ouverts au prix actuel
    if (ExecuteOrders.data.length > 0){
        console.log(ExecuteOrders.data.length);
        broadcastOrders(ExecuteOrders.data, wss2);
    }

};
const postDataSOLUSDT = async (ticker) => {

    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c) //ticker.c est le prix 'current' de la pair
    };
    broadcastDataPair("SOL/USDT",data,wss); //Partager le prix à tout les clients connectés
    await updateTokenPrices(ticker,"SOL/USDT");
    const ExecuteOrders = await ExecuteOpenedOrderByPair("SOL/USDT",parseFloat(ticker.c)); //récupérer tout les ordres ouverts au prix actuel
    if (ExecuteOrders.data.length > 0){
        broadcastOrders(ExecuteOrders.data, wss2);
    }
};

module.exports = { postDataBTCUSDT, postDataETHUSDT, postDataSOLUSDT };