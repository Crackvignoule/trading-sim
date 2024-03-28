const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getDataBTCUSDT } = require('../controllers/charts');
const { loginUser, registerUser } = require('../models/login');
const { getTokenAmountByUser, setUserWallet } = require('../models/userWallets');
const { getLastPriceByPair } = require('../models/price');


function generateToken(user) {
  // Charge utile (payload) du token
  const payload = {
    id: user.id, // Identifiant unique de l'utilisateur
    pseudo: user.pseudo
  };

  // Clé secrète pour signer le token
  const secret = 'PASSWORD';

  //Durée de valabilité du token
  const options = {
    expiresIn: '3h' // Le token expire après 3 heure
  };

  // Génération du token
  const token = jwt.sign(payload, secret, options);

  return token;
}

router.get('/chartBTCUSDT', async (req, res) => {
    try {
      const data = await getDataBTCUSDT();
      res.json(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });


  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const result = await registerUser(username, password);
    
    if (result.success) {
      res.status(201).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  });
  
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const result = await loginUser(username, password);
    
    if (result.success) {

      const token = generateToken(result.user);
      res.status(200).json({ message: result.message, token: token });
    } else {
      res.status(401).json({ message: result.message });
    }
  });


  router.post('/get-token-amount', async (req, res) => {
    const { pseudo, tokenName } = req.body;
    
    const result = await getTokenAmountByUser(pseudo, tokenName);
    
    if (result.success) {
      res.status(200).json({ amount: result.data.amount });
    } else {
      res.status(404).json({ message: result.message });
    }
});


router.post('/buy', async (req, res) => {
  const { amountBuyToken, amountSellToken, priceBuyToken, tradedPair, userPseudo, action , mode} = req.body;
  
  let result = {};
  if (mode == "market"){
    const data = await getLastPriceByPair(tradedPair);
    newpriceBuyToken = data.data.currentPrice;
    result = await setUserWallet(amountBuyToken, amountSellToken, newpriceBuyToken, tradedPair, userPseudo, action, mode);
  }
  else{
    result = await setUserWallet(amountBuyToken, amountSellToken, priceBuyToken, tradedPair, userPseudo, action, mode);
  }
  
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ message: result.message });
  }
});


  

  module.exports = router;
