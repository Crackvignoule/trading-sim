const { updatePricesBDTUSDT } = require('../models/updateBddPrices');
const { wss,broadcastDataBTCUSDT } = require('../services/serverWebSocket');

const postDataBTCUSDT = async (ticker) => {
    await updatePricesBDTUSDT(ticker);

    data = [{
        time : Math.floor(new Date(ticker.E).getTime() / 1000),
        value : parseFloat(ticker.c)
    }]
    broadcastDataBTCUSDT(data,wss)
};

module.exports = { postDataBTCUSDT };