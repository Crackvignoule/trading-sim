const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { initializeBinanceWebSocket } = require('./services/binanceWebSocket');
const { updateOldPrices } = require('./models/updateOldPrices');
require('./services/serverWebSocket');

const app = express();

// Load SSL certificate and key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

let serverUrl;
if (process.env.NODE_ENV === 'PROD') {
  serverUrl = process.env.PROD_SERVER_URL;
} else {
  serverUrl = process.env.DEV_SERVER_URL;
}

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', apiRouter);

const port = 5000;

updateOldPrices(); // Retrieves old pair values via the Binance API
initializeBinanceWebSocket();

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start server
httpsServer.listen(port, () => {
  console.log(`Server running at ${serverUrl}:${port}`);
});

module.exports = serverUrl;
