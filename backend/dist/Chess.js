"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chess = void 0;
const commands_1 = require("./commands");
class Chess {
    constructor(user1, user2) {
        this.user1 = user1;
        this.user2 = user2;
        this.board = this.initBoard();
        this.moves = [];
        this.currentPlayer = "A";
    }
    initBoard() {
        const board = [];
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                row.push({ player: null, piece: null });
            }
            board.push(row);
        }
        return board;
    }
    arrangePieces(user, arrangement) {
        const startRow = (user === "A") ? 0 : 4;
        for (let i = 0; i < 5; i++) {
            this.board[startRow][i] = { player: user, piece: arrangement[i] };
        }
        this.displayBoard();
    }
    displayBoard() {
        console.log("Current Board State:");
        for (let row of this.board) {
            const rowDisplay = row.map(cell => {
                return cell.piece ? `${cell.player}-${cell.piece}` : "__";
            });
            console.log(rowDisplay.join(" "));
        }
    }
    sendGameState() {
        const boardState = this.board.map(row => row.map(cell => cell.piece ? `${cell.player}-${cell.piece}` : "__"));
        const message = JSON.stringify({ type: commands_1.GAME_STATE_UPDATE, board: boardState });
        this.user1.send(message);
        this.user2.send(message);
    }
    sendInvalidMoveNotification(ws, move) {
        ws.send(JSON.stringify({ type: commands_1.INVALID_MOVE, move: move, reason: "Invalid move based on game rules" }));
    }
    sendGameOverNotification(winner) {
        const message = JSON.stringify({ type: commands_1.GAME_OVER, winner });
        this.user1.send(message);
        this.user2.send(message);
    }
    getPiecePosition(piece, player) {
        const pos = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j].piece === piece && this.board[i][j].player === player) {
                    pos.push(i);
                    pos.push(j);
                }
            }
        }
        return pos;
    }
    isValid(row, col) {
        if (row >= 0 && row < 5 && col >= 0 && col < 5 && this.board[row][col].piece === null) {
            return true;
        }
        return false;
    }
    isValidHeroMove(row, col, player) {
        if (row >= 0 && col >= 0 && row < 5 && col < 5) {
            if (this.board[row][col].piece !== null && this.board[row][col].player !== player) {
                return true;
            }
            else if (this.board[row][col].piece === null) {
                return true;
            }
        }
        return false;
    }
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "A" ? "B" : "A";
    }
    handlePawn(position, move, player) {
        if (player !== this.currentPlayer) {
            console.log(`It's not player ${player}'s turn.`);
            return;
        }
        let row = position[0];
        let col = position[1];
        let piece = this.board[row][col].piece;
        console.log(`row:${row},col:${col},player:${player}`);
        let forward = player === 'A' ? 1 : -1;
        let backward = player === 'A' ? -1 : 1;
        let left = player === 'A' ? 1 : -1;
        let right = player === 'A' ? -1 : 1;
        this.board[row][col] = { player: null, piece: null };
        if (move === "L" && this.isValid(row, col + left)) {
            this.board[row][col + left] = { player, piece };
        }
        else if (move === "R" && this.isValid(row, col + right)) {
            this.board[row][col + right] = { player, piece };
        }
        else if (move === "F" && this.isValid(row + forward, col)) {
            this.board[row + forward][col] = { player, piece };
        }
        else if (move === "B" && this.isValid(row + backward, col)) {
            this.board[row + backward][col] = { player, piece };
        }
        else {
            console.log(`Invalid move: ${move} for ${piece} by ${player}`);
            this.sendInvalidMoveNotification(this.currentPlayer === "A" ? this.user1 : this.user2, move);
            this.board[row][col] = { player, piece };
            this.switchPlayer();
        }
        this.displayBoard();
        this.sendGameState();
        const oppositePlayer = player === "A" ? "B" : "A";
        if (this.isGameCompleted(oppositePlayer)) {
            console.log(`Player ${player} wins!`);
            this.sendGameOverNotification(player);
            return;
        }
        this.switchPlayer();
    }
    handleHero1(position, move, player) {
        if (player !== this.currentPlayer) {
            console.log(`It's not player ${player}'s turn.`);
            return;
        }
        let row = position[0];
        let col = position[1];
        let piece = this.board[row][col].piece;
        let forward = player === 'A' ? 2 : -2;
        let backward = player === 'A' ? -2 : 2;
        let left = player === 'A' ? 2 : -2;
        let right = player === 'A' ? -2 : 2;
        this.board[row][col] = { player: null, piece: null };
        if (move === "L" && this.isValidHeroMove(row, col + left, player)) {
            this.board[row][col + left] = { player, piece };
        }
        else if (move === "R" && this.isValidHeroMove(row, col + right, player)) {
            this.board[row][col + right] = { player, piece };
        }
        else if (move === "F" && this.isValidHeroMove(row + forward, col, player)) {
            this.board[row + forward][col] = { player, piece };
        }
        else if (move === "B" && this.isValidHeroMove(row + backward, col, player)) {
            this.board[row + backward][col] = { player, piece };
        }
        else {
            console.log(`Invalid move: ${move} for ${piece} by ${player}`);
            this.sendInvalidMoveNotification(this.currentPlayer === "A" ? this.user1 : this.user2, move);
            this.board[row][col] = { player, piece };
            this.switchPlayer();
        }
        this.displayBoard();
        this.sendGameState();
        const oppositePlayer = player === "A" ? "B" : "A";
        if (this.isGameCompleted(oppositePlayer)) {
            console.log(`Player ${player} wins!`);
            this.sendGameOverNotification(player);
            return;
        }
        this.switchPlayer();
    }
    handleHero2(position, move, player) {
        if (player !== this.currentPlayer) {
            console.log(`It's not player ${player}'s turn.`);
            return;
        }
        let row = position[0];
        let col = position[1];
        let piece = this.board[row][col].piece;
        let forward = player === 'A' ? 2 : -2;
        let backward = player === 'A' ? -2 : 2;
        let left = player === 'A' ? 2 : -2;
        let right = player === 'A' ? -2 : 2;
        this.board[row][col] = { player: null, piece: null };
        if (move === "FL" && this.isValidHeroMove(row + forward, col + left, player)) {
            this.board[row + forward][col + left] = { player, piece };
        }
        else if (move === "FR" && this.isValidHeroMove(row + forward, col + right, player)) {
            this.board[row + forward][col + right] = { player, piece };
        }
        else if (move === "BL" && this.isValidHeroMove(row + backward, col + left, player)) {
            this.board[row + backward][col + left] = { player, piece };
        }
        else if (move === "BR" && this.isValidHeroMove(row + backward, col + right, player)) {
            this.board[row + backward][col + right] = { player, piece };
        }
        else {
            console.log(`Invalid move: ${move} for ${piece} by ${player}`);
            this.sendInvalidMoveNotification(this.currentPlayer === "A" ? this.user1 : this.user2, move);
            this.board[row][col] = { player, piece };
            this.switchPlayer();
        }
        this.displayBoard();
        this.sendGameState();
        const oppositePlayer = player === "A" ? "B" : "A";
        if (this.isGameCompleted(oppositePlayer)) {
            console.log(`Player ${player} wins!`);
            this.sendGameOverNotification(player);
            return;
        }
        this.switchPlayer();
    }
    isGameCompleted(player) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j].player === player) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.Chess = Chess;
