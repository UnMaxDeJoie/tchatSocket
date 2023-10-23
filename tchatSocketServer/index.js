const webSocketsServerPort = 8000;
const tchatSocketServer = require('websocket').server;
const http = require('http');

// Faire tourner le serveur http et websocket.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('en cours d\'exécution sur le port 8000');


const wsServer = new tchatSocketServer({
  httpServer: server
});

const clients = {};

// Générer un identifiant unique pour chaque utilisateur.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Réception d\'une nouvelle connexion depuis : ' + request.origin);

// A modifier pour n'accepter que les demandes provenant d'une origine autorisée.
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(userID + ' connecté dans ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Message reçu de : ', message.utf8Data);

// diffusion du message à tous les clients connectés
      for(key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log('Message envoyé à : ', clients[key]);
      }
    }
  })
});