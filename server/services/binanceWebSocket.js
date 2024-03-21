const WebSocket = require('ws');
const { postDataBTCUSDT } = require('../controllers/updatePrices');


const initializeBinanceWebSocket = () => {
  const binanceWsUrl = 'wss://stream.binance.com/ws/btcusdt@ticker';
  const ws = new WebSocket(binanceWsUrl);

  ws.on('open', function open() {
    console.log('Connected to Binance WebSocket API');
  });

  ws.on('message', function incoming(data) {
    const ticker = JSON.parse(data);
    postDataBTCUSDT(ticker).then(() => {
    }).catch(err => {
      console.error('Erreur lors de la mise à jour:', err);
    });

  });

  ws.on('close', function close() {
    console.log('Disconnected from Binance WebSocket API');
    setTimeout(initializeBinanceWebSocket, 10000); // Tente de se reconnecter après 10 secondes
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
    ws.close();
  });
};

module.exports = { initializeBinanceWebSocket };