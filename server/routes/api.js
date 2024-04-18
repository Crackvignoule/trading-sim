const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getDataBTCUSDT } = require('../controllers/charts');
const { loginUser, registerUser } = require('../models/login');
const { getTokenAmountByUser, setUserWallet, getUserSolde } = require('../models/userWallets');
const { getLastPriceByPair } = require('../models/price');
const { addNewTransaction, getUserOpenedOrder, getUserOrderHistory, deleteTransation, deleteAllUserTransation, getAllOrdersBuy, getAllOrdersSell  } = require('../models/transaction');
const { postOrders } = require('../controllers/updateOrders');


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
    const result = data.result;
    res.json(result);
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

      res.status(200).json({ message: result.message, data: result });
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
      
      //Pour distribuer l'ordre à tout les users
      postOrders({direction: transactionResult.data.direction ,tradedPair: transactionResult.data.pair, price: transactionResult.data.price, amount: transactionResult.data.amount, total: transactionResult.data.total});

      return res.status(transactionResult.success ? 200 : 404).json({ data:transactionResult.data, message: transactionResult.message });
    } else if (mode == "limit"){
      let amountToken = action === "buy" ? amountBuyToken : amountSellToken;
      let total = action === "buy" ? amountSellToken : amountBuyToken;
      const result = await addNewTransaction(userPseudo, tradedPair, priceBuyToken, amountToken, total, mode, action, "Opened");
      res.status(result.success ? 200 : 404).json({ data:result.data, message: result.message });
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

router.post('/get-user-opened-orders', async (req, res) => {
  const { pseudo } = req.body;
  const results = await getUserOpenedOrder(pseudo);
  
  if (results.success) {
    res.status(200).json({ data: results.data, message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});

router.post('/get-user-orders-history', async (req, res) => {
  const { pseudo } = req.body;
  const results = await getUserOrderHistory(pseudo);
  if (results.success) {
    res.status(200).json({ data: results.data, message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});


router.post('/del-transaction', async (req, res) => {
  const { idTrans } = req.body;
  const results = await deleteTransation(idTrans);
  if (results.success) {
    res.status(200).json({ data: results.data, message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});

router.post('/del-all-user-transaction', async (req, res) => {
  const { userPseudo } = req.body;
  const results = await deleteAllUserTransation(userPseudo);

  if (results.success) {
    res.status(200).json({ message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});


router.post('/get-all-buy-orders', async (req, res) => {
  const { tradedPair } = req.body;
  console.log("tradedPair api : ",tradedPair);
  const results = await getAllOrdersBuy(tradedPair);
  if (results.success) {
    res.status(200).json({ data: results, message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});

router.post('/get-all-sell-orders', async (req, res) => {
  const { tradedPair } = req.body;

  const results = await getAllOrdersSell(tradedPair);
  
  if (results.success) {
    res.status(200).json({ data: results, message: results.message });
  } else {
    res.status(404).json({ message: results.message });
  }
});

router.post('/get-user-solde', async (req, res) => {
  const { userToken } = req.body;
  
  const result = await getUserSolde(userToken);
  
  if (result.success) {
    res.status(200).json({ amount: result.data });
  } else {
    res.status(404).json({ message: result.message });
  }
});


  module.exports = router;
