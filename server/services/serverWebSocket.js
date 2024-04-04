const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté');
});

// Fonction pour diffuser les données à tous les clients
function broadcastDataPair(pair, data, wss) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      // Créer un nouvel objet contenant à la fois `data` et `pair`
      const message = {
        pair: pair,
        data: data,
      };
      // Envoyer ce nouvel objet comme une chaîne JSON
      client.send(JSON.stringify(message));
    }
  });
}


const wss2 = new WebSocket.Server({ port: 8585 });

wss2.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté');
});

// Fonction pour diffuser les données à tous les clients
function broadcastOrders(data, wss2) {
  wss2.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {

      // Envoyer ce nouvel objet comme une chaîne JSON
      client.send(JSON.stringify(data));
    }
  });
}
module.exports = { wss, broadcastDataPair,wss2, broadcastOrders };

