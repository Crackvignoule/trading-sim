const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté');
});

// Fonction pour diffuser les données à tous les clients
function broadcastDataBTCUSDT(data,wss) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { wss, broadcastDataBTCUSDT };

