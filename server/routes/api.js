const express = require('express');
const router = express.Router();
const { getDataBTCUSDT } = require('../controllers/charts');


router.get('/chartBTCUSDT', async (req, res) => {
    try {
      const data = await getDataBTCUSDT();
      res.json(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });

  module.exports = router;
