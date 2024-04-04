const { updateTokenPrices } = require('../models/updatePrices');
const { wss, broadcastDataPair } = require('../services/serverWebSocket');

const postDataBTCUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"BTC/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    broadcastDataPair("BTC/USDT",data,wss)
};
const postDataETHUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"ETH/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    broadcastDataPair("ETH/USDT",data,wss)
};
const postDataSOLUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"SOL/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    broadcastDataPair("SOL/USDT",data,wss)
};

module.exports = { postDataBTCUSDT, postDataETHUSDT, postDataSOLUSDT };