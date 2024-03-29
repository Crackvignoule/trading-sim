const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getDataBTCUSDT } = require('../controllers/charts');
const { loginUser, registerUser } = require('../models/login');
const { getTokenAmountByUser, setUserWallet } = require('../models/userWallets');
const { getLastPriceByPair } = require('../models/price');
const { addNewTransaction } = require('../models/transaction');


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


router.post('/buyAndSell', async (req, res) => {
  const { amountBuyToken, amountSellToken, priceBuyToken, tradedPair, userPseudo, action, mode } = req.body;

  try {
    if (mode == "market") {
      const data = await getLastPriceByPair(tradedPair);
      if (!data.success) {
        return res.status(404).json({ message: data.message });
      }

      const newpriceBuyToken = data.data.currentPrice;
      const walletUpdateResult = await setUserWallet(amountBuyToken, amountSellToken, newpriceBuyToken, tradedPair, userPseudo, action, mode);
      if (!walletUpdateResult.success) {
        return res.status(404).json({ message: walletUpdateResult.message });
      }

      let amountToken = action === "buy" ? amountBuyToken : amountSellToken;
      let total = action === "buy" ? amountSellToken : amountBuyToken;

      const transactionResult = await addNewTransaction(userPseudo, tradedPair, newpriceBuyToken, amountToken, total, mode, action, walletUpdateResult.success ? "Executed" : "Cancel");
      
      return res.status(transactionResult.success ? 200 : 404).json({ message: transactionResult.message });
    } else if (mode == "limit"){
      let amountToken = action === "buy" ? amountBuyToken : amountSellToken;
      let total = action === "buy" ? amountSellToken : amountBuyToken;
      const result = await addNewTransaction(userPseudo, tradedPair, priceBuyToken, amountToken, total, mode, action, "Open");
      res.status(result.success ? 200 : 404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution de la route :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



router.post('/get-last-price', async (req, res) => {
  const { tradedPair } = req.body;
  const result = await getLastPriceByPair(tradedPair);
  
  if (result.success) {
    res.status(200).json({ amount: result.data.currentPrice });
  } else {
    res.status(404).json({ message: result.message });
  }
});


  module.exports = router;
