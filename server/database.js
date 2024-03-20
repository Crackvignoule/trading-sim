const mysql = require('mysql2');

// Créez une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'server',
  password: 'password',
  database: 'TradingSimBdd',
  port : 3307
});

// Connexion à MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Connexion réussie à la base de données MySQL!");
});

module.exports = connection;
