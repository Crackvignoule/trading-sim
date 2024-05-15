const WebSocket = require('ws');
const { postData } = require('../controllers/updatePrices');

const initializeBinanceWebSocket = () => {
  const binanceWsUrl = 'wss://stream.binance.com/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker';
  const ws = new WebSocket(binanceWsUrl);

  ws.on('open', function open() {
    console.log('Connected to Binance WebSocket API');
  });

  ws.on('message', function incoming(data) {
    const response = JSON.parse(data);
    const { stream, data: ticker } = response; // Extraction du stream et des données du ticker

    // Dispatch en fonction du stream
    switch (stream) {
      case 'btcusdt@ticker':
        postData(ticker, 'BTC/USDT').catch(err => {
          console.error('Erreur lors de la mise à jour BTC:', err);
        });
        break;
      case 'ethusdt@ticker':
        
        postData(ticker, 'ETH/USDT').catch(err => {
          console.error('Erreur lors de la mise à jour ETH:', err);
        });
        break;
      case 'solusdt@ticker':
        postData(ticker, 'SOL/USDT').catch(err => {
          console.error('Erreur lors de la mise à jour SOL:', err);
        });
        break;
      default:
        console.log('Stream non reconnu:', stream);
    }
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
