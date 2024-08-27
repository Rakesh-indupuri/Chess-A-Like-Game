import React from "react";
import { Cell } from "../pages/Game"; // Ensure the Cell interface is exported

interface GameBoardProps {
  board: Cell[][];
  player: string;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  player,
  handleCellClick,
}) => {
  const getDisplayedBoard = () => {
    return player === "A" && board ? board.slice().reverse() : board;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-2xl mb-4 font-libre">Game Board</div>
      <div className="grid grid-cols-5 gap-1">
        {getDisplayedBoard()?.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isEmpty = !cell || (cell && !cell.piece);
            const cellPlayer = cell?.player || "";
            const cellPiece = cell?.piece || "";

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 border flex items-center justify-center cursor-pointer text-xl ${
                  cellPiece === "P"
                    ? "bg-blue-500 text-white"
                    : cellPiece === "H1"
                    ? "bg-red-500 text-white"
                    : cellPiece === "H2"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {!isEmpty ? `${cellPlayer}-${cellPiece}` : ""}
              </div>
            );
          })
        )}
      </div>
      {player && (
        <div className="mt-4 text-lg font-libre">
          You are Player {player}
        </div>
      )}
    </div>
  );
};