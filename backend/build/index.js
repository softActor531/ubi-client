"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
// std
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
// 3p
const core_1 = require("@foal/core");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const share_1 = __importDefault(require("./share"));
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
// import WebSocketJSONStream from '@soundation/websocket-json-stream';
// App
const app_controller_1 = require("./app/app.controller");
async function main() {
    const connectionOptions = await typeorm_1.getConnectionOptions();
    const databaseUrl = core_1.Config.get2('database.url', 'string');
    console.log('Database Connection Config: ');
    console.log(connectionOptions);
    console.log('Database URL: ');
    console.log(databaseUrl);
    await typeorm_1.createConnection();
    const expressApp = express_1.default();
    expressApp.use('/admin', express_1.default.static('../admin/build'));
    expressApp.use('/client', express_1.default.static('../client/build'));
    expressApp.use('/portal', express_1.default.static('../portal/build'));
    const app = core_1.createApp(app_controller_1.AppController, expressApp);
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        console.log('new WS Client Connection');
        const stream = new WebSocketJSONStream(ws);
        share_1.default.listen(stream);
    });
    // setInterval(() => {
    //   wss.clients.forEach((client) => {
    //     const time = new Date().toTimeString()
    //     client.send(JSON.stringify({ping: time}));
    //   });
    // }, 1000);
    const port = core_1.Config.get2('port', 'number', 3001);
    server.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}
main()
    .catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=index.js.map