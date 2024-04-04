const { updateTokenPrices } = require('../models/updatePrices');
const { wss, broadcastDataPair } = require('../services/serverWebSocket');

const postDataBTCUSDT = async (ticker) => {
    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    };
    broadcastDataPair("BTC/USDT",data,wss);
    await updateTokenPrices(ticker,"BTC/USDT");
};
const postDataETHUSDT = async (ticker) => {

    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    };
    broadcastDataPair("ETH/USDT",data,wss);
    await updateTokenPrices(ticker,"ETH/USDT");
};
const postDataSOLUSDT = async (ticker) => {

    data = {
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    };
    broadcastDataPair("SOL/USDT",data,wss);
    await updateTokenPrices(ticker,"SOL/USDT");
};

module.exports = { postDataBTCUSDT, postDataETHUSDT, postDataSOLUSDT };