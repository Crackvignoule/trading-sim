const {broadcastOrders} = require('../services/serverWebSocket');

const postOrders = async (order) => {

    broadcastOrders(order);
};

module.exports = { postOrders };