"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const commands_1 = require("./commands");
const Chess_1 = require("./Chess");
class Game {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
        this.userBoards = new Map();
    }
    addUser(user) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(user) {
        this.users = this.users.filter((u) => u !== user);
    }
    addHandler(ws) {
        ws.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            if (msg.type === commands_1.INIT_GAME) {
                this.userBoards.set(ws, msg.arrangement);
                if (this.pendingUser !== null && this.userBoards.has(this.pendingUser)) {
                    const chess = new Chess_1.Chess(this.pendingUser, ws);
                    this.games.push(chess);
                    const player1Setup = this.userBoards.get(this.pendingUser);
                    const player2Setup = msg.arrangement;
                    chess.arrangePieces("A", player1Setup);
                    chess.arrangePieces("B", player2Setup);
                    this.userBoards.delete(this.pendingUser);
                    this.userBoards.delete(ws);
                    this.pendingUser.send(JSON.stringify({ type: commands_1.INIT_GAME, board: chess.board, player: "A" }));
                    ws.send(JSON.stringify({ type: commands_1.INIT_GAME, board: chess.board, player: "B" }));
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = ws;
                }
            }
            if (msg.type === commands_1.READ_BOARD) {
                const game = this.games.find(game => game.user1 === ws || game.user2 === ws);
                console.log("Game board sent to client:", game === null || game === void 0 ? void 0 : game.board);
                if (game) {
                    ws.send(JSON.stringify({ type: commands_1.READ_BOARD, board: game.board }));
                }
            }
            if (msg.type === commands_1.MOVE) {
                const game = this.games.find((game) => game.user1 === ws || game.user2 === ws);
                if (game) {
                    const [piece, move] = msg.move.split(':');
                    const player = (ws === game.user1) ? "A" : "B";
                    const piecePosition = game.getPiecePosition(piece, player);
                    if (piece.startsWith('P')) {
                        game.handlePawn(piecePosition, move, player);
                    }
                    else if (piece === "H1") {
                        game.handleHero1(piecePosition, move, player);
                    }
                    else if (piece === "H2") {
                        game.handleHero2(piecePosition, move, player);
                    }
                }
            }
        });
    }
}
exports.Game = Game;
