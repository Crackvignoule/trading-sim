// Dropping collections if they exist
db.Transactions.drop();
db.Wallets.drop();
db.WalletsHistory.drop();
db.PricesHistory.drop();
db.Users.drop();
db.Pairs.drop();

db.createUser({
  user: "server",
  pwd: "password",
  roles: [{ role: "readWrite", db: "TradingSimBdd" }]
});

db.Pairs.insertMany([
  { _id: ObjectId(), namePair: 'BTC/USDT' },
  { _id: ObjectId(), namePair: 'ETH/USDT' },
  { _id: ObjectId(), namePair: 'SOL/USDT' }
]);

db.PricesHistory.insertMany([
  {
    _id: ObjectId(),
    idPair: ObjectId(),  // Reference to Pairs document
    currentPrice: 30000,
    lowestPrice: 29000,
    highestPrice: 31000,
    volume: 1000,
    datePrice: new Date()
  }
  // Add more price history records as needed
]);

db.WalletsHistory.insertMany([
  {
    idUser: ObjectId(),  // Reference to Users document
    total: 1000,
    dateWallet: new Date()
  }
  // Add more wallet history records as needed
]);

db.Wallets.insertMany([
  {
    idUser: ObjectId(),  // Reference to Users document
    tokenName: "BTC",
    amount: 1.5
  }
  // Add more wallets as needed
]);

db.Transactions.insertMany([
  {
    _id: ObjectId(),
    idUser: ObjectId(),  // Reference to Users document
    pair: "BTC/USDT",
    price: 30000,
    amount: 0.1,
    total: 3000,
    dateTrans: new Date(),
    type: "buy",
    direction: "long",
    statut: "completed"
  }
  // Add more transactions as needed
]);