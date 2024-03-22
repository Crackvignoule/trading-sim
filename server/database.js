const mysql = require('mysql2/promise');

// Création d'un pool de connexions
const db = mysql.createPool({
  host: 'localhost',
  user: 'server',
  database: 'TradingSimBdd',
  password: 'password',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tester la connexion
async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log("Connexion réussie à la base de données MySQL!");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données MySQL:", error);
  }
}

testConnection();

module.exports = db;
