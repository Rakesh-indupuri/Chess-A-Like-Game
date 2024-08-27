export const Rules = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg text-center font-libre">
        <h1 className="text-2xl font-bold mb-4">Game Rules</h1>
        <ol className="text-left">
          <li className="mb-2">
            The game is played between two players on a 5x5 grid.
          </li>
          <li className="mb-2">
            Each player controls a team of 5 characters, which can include Pawns, Hero1, and Hero2.
          </li>
          <li className="mb-4">
            Players arrange their characters on their respective starting rows at the beginning of the game.
          </li>
          <h2 className="text-xl font-semibold mb-2">Characters and Movement</h2>
          <li className="mb-2">
            <strong>Pawn:</strong>
            <ul className="list-disc ml-6">
              <li>Moves one block in any direction (Left, Right, Forward, or Backward).</li>
              <li>Move commands: L (Left), R (Right), F (Forward), B (Backward)</li>
            </ul>
          </li>
          <li className="mb-2">
            <strong>Hero1:</strong>
            <ul className="list-disc ml-6">
              <li>Moves two blocks straight in any direction.</li>
              <li>Kills any opponent's character in its path.</li>
              <li>Move commands: L (Left), R (Right), F (Forward), B (Backward)</li>
            </ul>
          </li>
          <li className="mb-2">
            <strong>Hero2:</strong>
            <ul className="list-disc ml-6">
              <li>Moves two blocks diagonally in any direction.</li>
              <li>Kills any opponent's character in its path.</li>
              <li>Move commands: FL (Forward-Left), FR (Forward-Right), BL (Backward-Left), BR (Backward-Right)</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};