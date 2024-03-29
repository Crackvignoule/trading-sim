const { updateTokenPrices } = require('../models/updatePrices');
const { wss,broadcastDataBTCUSDT } = require('../services/serverWebSocket');

const postDataBTCUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"BTC/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    //broadcastDataBTCUSDT(data,wss)
};
const postDataETHUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"ETH/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    //broadcastDataBTCUSDT(data,wss)
};
const postDataSOLUSDT = async (ticker) => {
    await updateTokenPrices(ticker,"SOL/USDT");

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    //broadcastDataBTCUSDT(data,wss)
};

module.exports = { postDataBTCUSDT, postDataETHUSDT, postDataSOLUSDT };