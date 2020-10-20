"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharedb_1 = __importDefault(require("sharedb"));
const share = new sharedb_1.default({
    db: new sharedb_1.default.MemoryDB(),
});
share.use('receive', function (req, next) {
    var data = req.data || {};
    switch (data.a) {
        case 'heartbeat': break;
        default:
            next();
            break;
    }
});
const connection = share.connect();
exports.connection = connection;
exports.createDoc = (roomName, callback) => {
    // const connection = share.connect();
    const doc = connection.get(roomName, 'textarea');
    doc.on('create', (src) => {
        console.log(`New doc created for room: ${roomName}`);
    });
    doc.fetch((err) => {
        if (err) {
            console.log('Something went wrong!');
            throw err;
        }
        if (doc.type === null) {
            // doc.create({content: ''}, callback);
            doc.create('', callback);
            return;
        }
        if (callback) {
            callback();
        }
    });
};
exports.default = share;
//# sourceMappingURL=share.js.map