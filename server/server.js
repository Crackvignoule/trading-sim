const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api');
const { initializeBinanceWebSocket } = require('./services/binanceWebSocket');
const {updateOldPrices} =  require('./models/updateOldPrices');
require('./services/serverWebSocket');

let serverUrl;
if (process.env.NODE_ENV === 'PROD') {
  serverUrl = process.env.PROD_SERVER_URL;
} else {
  serverUrl = process.env.DEV_SERVER_URL;
}

app.use(express.json());
app.use(cors({
  origin: `${serverUrl}:3000`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', apiRouter);

const port = 5000;

//updateOldPrices(); récupère les anciennes valeurs des pairs via api binance
initializeBinanceWebSocket();

app.listen(port, () => {
  console.log(`Server running at ${serverUrl}:${port}`);
});