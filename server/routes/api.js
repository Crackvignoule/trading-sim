const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getDataBTCUSDT } = require('../controllers/charts');
const { loginUser, registerUser } = require('../models/login');

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

      const token = generateToken(result.user);
      res.status(200).json({ message: result.message, token: token });
    } else {
      res.status(401).json({ message: result.message });
    }
  });
  

  module.exports = router;
