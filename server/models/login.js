const db = require("../database");
const bcrypt = require('bcryptjs');


async function loginUser(pseudo, password) {
  try {
      const query = 'SELECT idUser, pseudo, passwordUser FROM Users WHERE pseudo = ?';
      const [rows] = await db.query(query, [pseudo]);
      
      if (rows.length > 0) {
          const passwordIsValid = await bcrypt.compare(password, rows[0].passwordUser);
          if (passwordIsValid) {
              // Connexion réussie
              return { 
                  success: true, 
                  message: "Connexion réussie.",
                  user: {
                      id: rows[0].idUser,
                      pseudo: rows[0].pseudo
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
      const query = 'INSERT INTO Users (pseudo, passwordUser, dateCrea) VALUES (?, ?, NOW())';
      const [result] = await db.query(query, [pseudo, hashedPassword]);
  
      if (result.affectedRows > 0) {
        return { success: true, message: "Inscription réussie." };
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
  