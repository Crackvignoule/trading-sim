const { getRanking } = require('../models/userWallets');
const { Server } = require('socket.io');

let serverUrl;
if (process.env.NODE_ENV === 'PROD') {
  serverUrl = process.env.PROD_SERVER_URL;
} else {
  serverUrl = process.env.DEV_SERVER_URL;
}

const io = new Server(8888, {
  cors: {
    origin: `${serverUrl}:3000`,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const clients = {}; // Stocke les paires token: socket

io.on('connection', (socket) => {
  console.log('Un client s\'est connecté');

  socket.on('join', (channel, userToken) => {
    console.log(`Un client s'est connecté au canal ${channel}`);
    socket.join(channel);
    
    if (userToken) {
      clients[userToken] = socket;
      console.log(`Utilisateur ${userToken} enregistré.`);
    }

    if (channel === 'ranking') {
      getRanking()
        .then((data) => {
          io.to('ranking').emit('dataRank', data);
        })
        .catch((error) => {
          console.error('Error fetching ranking data:', error);
        });
    }
  });

  socket.on('disconnect', () => {
    // Supprimez le token de clients lorsqu'un utilisateur se déconnecte
    for (const token in clients) {
      if (clients[token] === socket) {
        delete clients[token];
        break;
      }
    }
    console.log('Un client s\'est déconnecté');
  });
});

function broadcastOrders(data) {
  io.to('orders').emit('dataAllOrders', data);
}

function sendToUser(userToken, data) {
  if (clients[userToken]) {
    clients[userToken].to('userOrders').emit('dataOrders', data);
  }
}

function broadcastDataPair(pair, data) {
  const message = {
    pair: pair,
    data: data,
  };
  io.to('prices').emit('dataPrices', message);
}

function sendToUserSolde(userToken, data) {
  if (clients[userToken]) {
    const solde = {
      userSolde: data,
      userToken: userToken
    };
    clients[userToken].to('userSolde').emit('dataSolde', solde);
  }
}
const getClientTokens = () => {
  return Object.keys(clients);
};
setInterval(() => {
  getRanking()
    .then((data) => {
      io.to('ranking').emit('dataRank', data);
    })
    .catch((error) => {
      console.error('Error fetching ranking data:', error);
    });
}, 200);
module.exports = { broadcastDataPair, broadcastOrders, sendToUser, sendToUserSolde, getClientTokens };
