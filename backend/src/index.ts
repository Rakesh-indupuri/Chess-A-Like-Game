import { WebSocketServer } from 'ws';
import { Game } from './Game';

const wss = new WebSocketServer({ port: 4000 });

const chess=new Game();

wss.on('connection', function connection(ws) {
  chess.addUser(ws);
  ws.on("disconnect",()=>chess.removeUser(ws));
  ws.on('message', function message(data) {
    // console.log('received: %s', data);
  });
  // ws.send('something');
});