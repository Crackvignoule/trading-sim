const {wss2, broadcastOrders} = require('../services/serverWebSocket');

const postOrders = async (order) => {

    broadcastOrders(order,wss2);
};

module.exports = { postOrders };