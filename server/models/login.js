const db = require("../database");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');


async function loginUser(pseudo, password) {
  try {
      const query = 'SELECT idUser, pseudo, passwordUser FROM Users WHERE pseudo = ?';
      const [rows] = await db.query(query, [pseudo]);
      
      if (rows.length > 0) {
          const passwordIsValid = await bcrypt.compare(password, rows[0].passwordUser);
          if (passwordIsValid) {
              const newUserToken = uuidv4();
              const updateTokenQuery = 'UPDATE Users SET userToken = ? WHERE idUser = ?';
              
              await db.query(updateTokenQuery, [newUserToken, rows[0].idUser]);

              // Connexion réussie
              return { 
                  success: true, 
                  message: "Connexion réussie.",
                  user: {
                      id: rows[0].idUser,
                      pseudo: rows[0].pseudo,
                      token: newUserToken
                  }
              };
          } else {
              // Mot de passe incorrect
              return { success: false, message: "Mot de passe incorrect." };
          }
      } else {
          // Utilisateur non trouvé
          return { success: false, message: "Utilisateur non trouvé." };
      }
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return { success: false, message: "Erreur lors de la connexion." };
  }
}

  
async function registerUser(pseudo, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hache le mot de passe
    const userToken = uuidv4(); // Génère un token unique pour l'utilisateur

    // Insérer dans la table Users
    const userInsertQuery = 'INSERT INTO Users (pseudo, passwordUser, dateCrea, userToken) VALUES (?, ?, NOW(), ?)';
    const [userResult] = await db.query(userInsertQuery, [pseudo, hashedPassword, userToken]);
  
    if (userResult.affectedRows > 0) {
      // Insérer dans la table Wallets
      const walletInsertQuery = `
      INSERT INTO Wallets (idUser, tokenName, amount) 
      VALUES (?, "USDT", 10000),
      (?,"BTC",0),
      (?,"ETH",0),
      (?,"SOL",0)`;
      const [walletResult] = await db.query(walletInsertQuery, [userResult.insertId,userResult.insertId,userResult.insertId,userResult.insertId]); // Utilise userResult.insertId pour obtenir l'ID de l'utilisateur inséré
      
      return { success: true, message: "Inscription réussie avec solde initial." };
    } else {
      return { success: false, message: "Échec de l'inscription." };
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Gestion d'un pseudo déjà utilisé
      return { success: false, message: "Pseudo déjà utilisé." };
    } else {
      console.error("Erreur lors de l'inscription :", error);
      return { success: false, message: "Erreur lors de l'inscription." };
    }
  }
}
  
  module.exports = { loginUser, registerUser };
  