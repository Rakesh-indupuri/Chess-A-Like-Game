"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Game_1 = require("./Game");
const wss = new ws_1.WebSocketServer({ port: 4000 });
const chess = new Game_1.Game();
wss.on('connection', function connection(ws) {
    chess.addUser(ws);
    ws.on("disconnect", () => chess.removeUser(ws));
    ws.on('message', function message(data) {
        // console.log('received: %s', data);
    });
    // ws.send('something');
});
