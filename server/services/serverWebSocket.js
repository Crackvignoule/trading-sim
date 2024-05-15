const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté');
});

// Serveur WebSocket pour la diffusion à tous les clients
const wss2 = new WebSocket.Server({ port: 8585 });
const clients = {}; // Stocke les paires token: ws pour wss3
const clientsSoldeToken = {}; // Stocke les paires token: ws pour wss4

wss2.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à wss2 pour les diffusions');

  // Vous pouvez ajouter ici des logiques spécifiques à wss2 si nécessaire
});

// Fonction pour diffuser les données à tous les clients connectés à wss2
function broadcastOrders(data) {
  wss2.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Serveur WebSocket pour envoyer des données à un utilisateur spécifique
const wss3 = new WebSocket.Server({ port: 8686 });

wss3.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à wss3 pour la communication individuelle');

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      // Si le message contient un token, associez ce WebSocket à ce token.
      if (data.type === 'registration' && data.token) {
        clients[data.token] = ws;
        console.log(`Utilisateur ${data.token} enregistré sur wss3.`);
      }
    } catch (error) {
      console.error('Erreur de traitement du message sur wss3', error);
    }
  });
});

// Fonction pour envoyer des données à un utilisateur spécifique connecté à wss3
function sendToUser(userToken, data) {
  
  if (clients[userToken] && clients[userToken].readyState === WebSocket.OPEN) {
    clients[userToken].send(JSON.stringify(data));
  }
}


// Serveur WebSocket pour envoyer la valeur du solde à un utilisateur spécifique
const wss4 = new WebSocket.Server({ port: 8787 });

wss4.on('connection', function connection(ws) {
  console.log('Un client s\'est connecté à wss4 pour la communication individuelle');

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      // Si le message contient un token, associez ce WebSocket à ce token.
      if (data.type === 'registration' && data.token) {
        clientsSoldeToken[data.token] = ws;
        console.log(`Utilisateur ${data.token} enregistré sur wss4.`);
      }
    } catch (error) {
      console.error('Erreur de traitement du message sur wss4', error);
    }
  });
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

// Fonction pour envoyer des données à un utilisateur spécifique connecté à wss3
function sendToUserSolde(userToken, data) {
  if (clientsSoldeToken[userToken] && clientsSoldeToken[userToken].readyState === WebSocket.OPEN) {
    const payload = {
      userSolde: data
    };
    clientsSoldeToken[userToken].send(JSON.stringify(payload));
  }
}

module.exports = { wss, broadcastDataPair, broadcastOrders, sendToUser, sendToUserSolde, clientsSoldeToken };

