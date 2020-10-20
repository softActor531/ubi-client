import { SDBDoc, SDBClient } from 'sdb-ts'
import StringBinding from '../lib/sdb-string-binding';
import ReconnectingWebSocket from 'reconnecting-websocket';

let HOST = 'wss://ubi-client.herokuapp.com';
try {
  const locationOrigin = window.location.origin;
  HOST = locationOrigin.includes("https") ? locationOrigin.replace(/^https/, 'wss') : locationOrigin.replace(/^http/, 'ws')
  if (HOST.includes("localhost")) {
    HOST = HOST.replace(/3000/, '3001')
  }
  console.log('Websocket Host: ', HOST)
} catch (err) {
  console.error('Unable to detect WebSocket Address');
}

// Expose a singleton WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket(HOST);
// const connection = new sharedb.Connection(socket as WebSocket);
const connection = new SDBClient(socket);

// Define heartbeat API
let heartbeatInterval: any = null;

const heartbeat = function(){
  socket.send('{"a":"heartbeat"}');
}

socket.addEventListener('open', function() {
  console.log('Socket Open')
});

socket.addEventListener('close', function() {
  console.log('Socket Close')
});

socket.addEventListener('error', function() {
  console.log('Socket Error')
});

socket.addEventListener('open', () => {
  heartbeatInterval = setInterval(heartbeat, 30000);
  console.log('WebSocket Connected!');
});

socket.addEventListener('close', () => {
  clearInterval(heartbeatInterval);
  console.log('WebSocket Disconnected!');
});

// Export API
export { socket, StringBinding, SDBDoc };
export default connection;
