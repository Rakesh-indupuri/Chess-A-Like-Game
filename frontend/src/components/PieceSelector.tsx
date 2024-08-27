import React from "react";

interface PieceSelectorProps {
  pieces: string[];
  selectedPieces: string[];
  handlePieceClick: (piece: string) => void;
  handleSubmit: () => void;
  handleReset: () => void;
}

export const PieceSelector: React.FC<PieceSelectorProps> = ({
  pieces,
  selectedPieces,
  handlePieceClick,
  handleSubmit,
  handleReset,
}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-4 font-libre">Select Your Pieces</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {pieces.map((piece, index) => (
            <button
              key={index}
              className={`py-2 px-4 border rounded font-chivo ${
                selectedPieces.includes(piece)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
              onClick={() => handlePieceClick(piece)}
              disabled={selectedPieces.includes(piece)}
            >
              {piece}
            </button>
          ))}
        </div>
        <div className="mb-4 text-lg font-libre">
          Selected Pieces: {selectedPieces.join(", ")}
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded font-libre"
            onClick={handleSubmit}
          >
            Confirm & Play
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded font-libre"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};