import React, { useState, useEffect } from "react";
import { PieceSelector } from "../components/PieceSelector";
import { GameBoard } from "../components/GameBoard";

export interface Cell {
  player: string | null;
  piece: string | null;
}

export const Game = () => {
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [player, setPlayer] = useState<string>("");

  const pieces = ["H1", "H2", "P1", "P2", "P3"];

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log("Message received from server:", msg);

      if (msg.type === "Initialize-game") {
        console.log("Game initialized with board:", msg.board);
        setPlayer(msg.player);
        setBoard(msg.board);
        setIsBoardVisible(true);
      } else if (msg.type === "invalid_move") {
        setMessage(`Invalid move: ${msg.move}. Reason: ${msg.reason}`);
        alert("Invalid Move")
      } else if (msg.type === "game_over") {
        setMessage(`Game Over! Player ${msg.winner} wins!`);
      } else if (msg.type === "game_state_update") {
        const convertedBoard = msg.board.map((row: string[]) =>
            row.map((cell: string) => {
              if (cell === '__') {
                return { player: null, piece: null };
              } else {
                const [player, piece] = cell.split('-');
                return { player, piece };
              }
            })
          );
        console.log("Converted board:", convertedBoard);
        setBoard(convertedBoard);
        setMessage('');
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handlePieceClick = (piece: string) => {
    if (selectedPieces.length < 5) {
      setSelectedPieces((prev) => [...prev, piece]);
    }
  };

  const handleReset = () => {
    setSelectedPieces([]);
  };

  const handleSubmit = () => {
    if (selectedPieces.length === 5 && socket) {
      console.log("Submitting selected pieces");
      const data = { type: "Initialize-game", arrangement: selectedPieces };
      socket.send(JSON.stringify(data));
    } else {
      alert("Please select 5 pieces before proceeding.");
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    let adjustedRowIndex = rowIndex;
    if (player === "A") {
      adjustedRowIndex = board ? 4 - rowIndex : rowIndex;
    }
  
    if (!selectedCell) {
      const cell = board ? board[adjustedRowIndex][colIndex] : null;
      if (cell && cell.piece) {
        setSelectedCell({ row: adjustedRowIndex, col: colIndex });
        setSelectedPiece(cell.piece);
        console.log(`Selected piece at row ${adjustedRowIndex}, col ${colIndex}: ${cell.piece}`);
      } else {
        setMessage("Select a valid piece to move.");
      }
    } else {
      const fromRow = selectedCell.row;
      const fromCol = selectedCell.col;
      const toRow = adjustedRowIndex;
      const toCol = colIndex;
  
      if (selectedPiece) {
        const direction = determineDirection(fromRow, fromCol, toRow, toCol, player, selectedPiece);
        if (direction) {
          const move = `${selectedPiece}:${direction}`;
          console.log(`Sending move: ${move}`);
          if (socket) {
            socket.send(JSON.stringify({ type: "move", move }));
          }else{
            console.log("unable to connect to socket")
          }
        } else {
          setMessage("Invalid move. Please select a valid target.");
        }
      }
      setSelectedCell(null);
      setSelectedPiece(null);
    }
  };
  

  const determineDirection = (fromRow: number, fromCol: number, toRow: number, toCol: number, player: string, piece: string): string => {
    if (piece.startsWith("P")) {
      return determinePawnDirection(fromRow, fromCol, toRow, toCol, player);
    } else if (piece === "H1" || piece === "H2") {
      return determineHeroDirection(fromRow, fromCol, toRow, toCol, player, piece);
    }
    return "";
  };

  const determinePawnDirection = (fromRow: number, fromCol: number, toRow: number, toCol: number, player: string): string => {
    if (player === "A") {
      if (toRow === fromRow + 1 && toCol === fromCol) return "F";
      if (toRow === fromRow - 1 && toCol === fromCol) return "B";
      if (toRow === fromRow && toCol === fromCol + 1) return "L";
      if (toRow === fromRow && toCol === fromCol - 1) return "R";
    } else {
      if (toRow === fromRow - 1 && toCol === fromCol) return "F";
      if (toRow === fromRow + 1 && toCol === fromCol) return "B";
      if (toRow === fromRow && toCol === fromCol - 1) return "L";
      if (toRow === fromRow && toCol === fromCol + 1) return "R";
    }
    return "";
  };

  const determineHeroDirection = (fromRow: number, fromCol: number, toRow: number, toCol: number, player: string, piece: string): string => {
    if (piece === "H1") {
      if (player === "A") {
        if (toRow === fromRow + 2 && toCol === fromCol) return "F";
        if (toRow === fromRow - 2 && toCol === fromCol) return "B";
        if (toRow === fromRow && toCol === fromCol + 2) return "L";
        if (toRow === fromRow && toCol === fromCol - 2) return "R";
      } else {
        if (toRow === fromRow - 2 && toCol === fromCol) return "F";
        if (toRow === fromRow + 2 && toCol === fromCol) return "B";
        if (toRow === fromRow && toCol === fromCol - 2) return "L";
        if (toRow === fromRow && toCol === fromCol + 2) return "R";
      }
    } else if (piece === "H2") {
      if (player === "A") {
        if (toRow === fromRow + 2 && toCol === fromCol + 2) return "FL";
        if (toRow === fromRow + 2 && toCol === fromCol - 2) return "FR";
        if (toRow === fromRow - 2 && toCol === fromCol + 2) return "BL";
        if (toRow === fromRow - 2 && toCol === fromCol - 2) return "BR";
      } else {
        if (toRow === fromRow - 2 && toCol === fromCol - 2) return "FL";
        if (toRow === fromRow - 2 && toCol === fromCol + 2) return "FR";
        if (toRow === fromRow + 2 && toCol === fromCol - 2) return "BL";
        if (toRow === fromRow + 2 && toCol === fromCol + 2) return "BR";
      }
    }
    return "";
  };

  const getDisplayedBoard = () => {
    return player === "A" && board ? board.slice().reverse() : board;
  };

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message]);

  return (
    <div className="font-libre h-screen flex flex-col justify-center items-center">
      {!isBoardVisible ? (
        <PieceSelector
          pieces={pieces}
          selectedPieces={selectedPieces}
          handlePieceClick={handlePieceClick}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
      ) : (
        <div className="flex flex-col items-center">
          <GameBoard
            board={board || []}
            player={player}
            handleCellClick={handleCellClick}
          />
        </div>
      )}
    </div>
  );  
};