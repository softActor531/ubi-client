import 'source-map-support/register';

// std
import * as http from 'http';
import * as WebSocket from 'ws';

// 3p
import { Config, createApp } from '@foal/core';
import express from 'express';
import { createConnection, getConnectionOptions } from 'typeorm';

import share from './share';
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
// import WebSocketJSONStream from '@soundation/websocket-json-stream';

// App
import { AppController } from './app/app.controller';

async function main() {

  const connectionOptions = await getConnectionOptions();
  const databaseUrl = Config.get2('database.url', 'string');

  console.log('Database Connection Config: ')
  console.log(connectionOptions)

  console.log('Database URL: ')
  console.log(databaseUrl)

  await createConnection();

  const expressApp = express();
  expressApp.use('/admin', express.static('../admin/build'));
  expressApp.use('/client', express.static('../client/build'));
  expressApp.use('/portal', express.static('../portal/build'));

  const app = createApp(AppController, expressApp);

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws: WebSocket) => {
    console.log('new WS Client Connection')
    const stream = new WebSocketJSONStream(ws);
    share.listen(stream);
  });

  // setInterval(() => {
  //   wss.clients.forEach((client) => {
  //     const time = new Date().toTimeString()
  //     client.send(JSON.stringify({ping: time}));
  //   });
  // }, 1000);

  const port = Config.get2('port', 'number', 3001);
  server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main()
  .catch(err => { console.error(err); process.exit(1); });
