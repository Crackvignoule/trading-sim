const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB connection URI and options
const uri = `mongodb://${process.env.DB_HOST}:27017`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Database name
const dbName = 'TradingSimBdd';

// Function to test the connection
async function testConnection() {
  let client;
  try {
    client = new MongoClient(uri, options);
    await client.connect();
    console.log("Connexion réussie à la base de données MongoDB!");

    const db = client.db(dbName);
    // Example query to test the connection
    const collection = db.collection('Pairs');
    const count = await collection.countDocuments();
    console.log(`Nombre de documents dans la collection Pairs: ${count}`);
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données MongoDB:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testConnection();

module.exports = {
  connectToDatabase: async () => {
    const client = new MongoClient(uri, options);
    await client.connect();
    return client.db(dbName);
  }
};
