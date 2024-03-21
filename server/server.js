const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api');
const { initializeBinanceWebSocket } = require('./services/binanceWebSocket');
require('./models/updateOldPrices');
require('./services/serverWebSocket');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', apiRouter);

const port = 5000;

updateOldPrices();
initializeBinanceWebSocket();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});