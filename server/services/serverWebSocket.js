const { getRanking } = require('../models/userWallets');
const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 8080 });
const ws2 = new WebSocket.Server({ port: 8585 });
const ws3 = new WebSocket.Server({ port: 8686 });
const ws4 = new WebSocket.Server({ port: 8787 });
const ws5 = new WebSocket.Server({ port: 8888 });

ws.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté');
});

// Serveur WebSocket pour la diffusion à tous les clients
const clients = {}; // Stocke les paires token: ws pour ws3
const clientsSoldeToken = {}; // Stocke les paires token: ws pour ws4

ws2.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à ws2 pour les diffusions');

  // Vous pouvez ajouter ici des logiques spécifiques à ws2 si nécessaire
});

// Serveur WebSocket pour envoyer des données à un utilisateur spécifique
ws3.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à ws3 pour la communication individuelle');

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      // Si le message contient un token, associez ce WebSocket à ce token.
      if (data.type === 'registration' && data.token) {
        clients[data.token] = ws;
        console.log(`Utilisateur ${data.token} enregistré sur ws3.`);
      }
    } catch (error) {
      console.error('Erreur de traitement du message sur ws3', error);
    }
  });
});

// Serveur WebSocket pour envoyer la valeur du solde à un utilisateur spécifique
ws4.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à ws4 pour la communication individuelle');

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      // Si le message contient un token, associez ce WebSocket à ce token.
      if (data.type === 'registration' && data.token) {
        clientsSoldeToken[data.token] = ws;
        console.log(`Utilisateur ${data.token} enregistré sur ws4.`);
      }
    } catch (error) {
      console.error('Erreur de traitement du message sur ws4', error);
    }
  });
});

ws5.on('connection', function connection(ws) {
  console.log('A client has connected to ws5 for individual communication');

  // Fetch ranking data when a client connects
  const sendRankingData = () => {
    getRanking()
      .then((data) => {
        ws.send(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error fetching ranking data:', error);
      });
  };

  // Send ranking data immediately
  sendRankingData();

  // Then send ranking data every second
  const intervalId = setInterval(sendRankingData, 10);

  // Clear the interval when the client disconnects
  ws.on('close', () => {
    clearInterval(intervalId);
  });
});

// Fonction pour diffuser les données à tous les clients connectés à ws2
function broadcastOrders(data) {
  ws2.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Fonction pour envoyer des données à un utilisateur spécifique connecté à ws3
function sendToUser(userToken, data) {
  
  if (clients[userToken] && clients[userToken].readyState === WebSocket.OPEN) {
    clients[userToken].send(JSON.stringify(data));
  }
}

// Fonction pour diffuser les données à tous les clients
function broadcastDataPair(pair, data, ws) {
  ws.clients.forEach(function each(client) {
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

// Fonction pour envoyer des données à un utilisateur spécifique connecté à ws3
function sendToUserSolde(userToken, data) {
  if (clientsSoldeToken[userToken] && clientsSoldeToken[userToken].readyState === WebSocket.OPEN) {
    const payload = {
      userSolde: data
    };
    clientsSoldeToken[userToken].send(JSON.stringify(payload));
  }
}

module.exports = { ws, broadcastDataPair, broadcastOrders, sendToUser, sendToUserSolde, clientsSoldeToken };

