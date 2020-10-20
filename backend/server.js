const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
// const WebSocketJSONStream = require('websocket-json-stream');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
let sessionId;

const port = process.env.PORT || 3001;

const backend = new ShareDB();
startServer();
// createDoc(startServer());

// // Create initial document then fire callback
// function createDoc(callback) {
//   const connection = backend.connect();
//   const doc = connection.get('examples', 'textarea');
//   doc.fetch(function(err) {
//     if (err) {
//       console.log('Something went wrong!')
//       throw err;
//     }
//     if (doc.type === null) {
//       console.log('Creating an empty doc')
//       // doc.create({content: ''}, callback);
//       doc.create('', callback);
//       return;
//     }
//     console.log('Starting Server...')
//     callback();
//   });
// }

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express();
  app.use(cors());

  // if (process.env.NODE_ENV === 'production') {
  //   // Serve any static files
  //   app.use(express.static(path.join(__dirname, 'build')));
  //   // Handle React routing, return all requests to React app
  //   app.get('*', function(req, res) {
  //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
  //   });
  // }

  const server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server },{ origin: '*'});

  wss.on('connection', function(ws, req) {
    console.log('new WS Client Connection')
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  // setInterval(() => {
  //   wss.clients.forEach((client) => {
  //     const time = new Date().toTimeString()
  //     client.send(JSON.stringify({ping: time}));
  //   });
  // }, 1000);

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log('Listening on http://%s:%s', server.address().address, server.address().port);
  });
}
