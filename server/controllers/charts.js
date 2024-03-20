const { selectDataBTCUSDT } = require('../models/charts');

const getDataBTCUSDT = async (req, res) => {
    const data = await selectDataBTCUSDT();
    return data;
};

module.exports = { getDataBTCUSDT };