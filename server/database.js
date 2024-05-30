const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Création d'un pool de connexions
console.log("DB_HOST", process.env.DB_HOST);
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: 'server',
  database: 'TradingSimBdd',
  password: 'password',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Timeout de connexion de 10 secondes
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
