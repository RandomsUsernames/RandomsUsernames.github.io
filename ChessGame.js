import React, { useState, useCallback } from 'react';

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(''),
  Array(8).fill(''),
  Array(8).fill(''),
  Array(8).fill(''),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const ChessGame = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameOver, setGameOver] = useState(false);
  const [useReactChessboard, setUseReactChessboard] = useState(true); // Toggle between React and HTML

  const isValidMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Check if the target square is occupied by a piece of the same player
    if (targetPiece !== '') {
      const isCurrentPlayerPiece = currentPlayer === 'white' ? 
        targetPiece === targetPiece.toUpperCase() : 
        targetPiece === targetPiece.toLowerCase();
      if (isCurrentPlayerPiece) return false;
    }

    // Add specific move validation for each piece type
    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        return validatePawnMove(from, to);
      case 'r': // Rook
        return validateRookMove(from, to);
      case 'n': // Knight
        return validateKnightMove(from, to);
      case 'b': // Bishop
        return validateBishopMove(from, to);
      case 'q': // Queen
        return validateQueenMove(from, to);
      case 'k': // King
        return validateKingMove(from, to);
      default:
        return false;
    }
  };

  const validatePawnMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const direction = currentPlayer === 'white' ? -1 : 1;

    // Basic pawn move (1 square forward)
    if (toCol === fromCol && toRow === fromRow + direction && board[toRow][toCol] === '') {
      return true;
    }

    // Pawn capture (diagonal)
    if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && board[toRow][toCol] !== '') {
      return true;
    }

    return false;
  };

  const validateRookMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    // Rook moves in straight lines
    if (fromRow !== toRow && fromCol !== toCol) return false;

    // Check for obstacles in the path
    if (fromRow === toRow) {
      const step = toCol > fromCol ? 1 : -1;
      for (let col = fromCol + step; col !== toCol; col += step) {
        if (board[fromRow][col] !== '') return false;
      }
    } else {
      const step = toRow > fromRow ? 1 : -1;
      for (let row = fromRow + step; row !== toRow; row += step) {
        if (board[row][fromCol] !== '') return false;
      }
    }

    return true;
  };

  // Add similar validation functions for other pieces (Knight, Bishop, Queen, King)

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver) return;

    if (!selectedPiece) {
      const piece = board[row][col];
      if (!piece) return;

      const isPieceCurrentPlayer = currentPlayer === 'white' ? 
        piece === piece.toUpperCase() : 
        piece === piece.toLowerCase();

      if (isPieceCurrentPlayer) {
        setSelectedPiece([row, col]);
      }
    } else {
      const [selectedRow, selectedCol] = selectedPiece;

      if (isValidMove(selectedPiece, [row, col])) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = board[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = '';

        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
      setSelectedPiece(null);
    }
  }, [board, selectedPiece, currentPlayer, gameOver]);

  const getPieceSymbol = (piece) => {
    const symbols = {
      'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙',
      'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟'
    };
    return symbols[piece] || '';
  };

  const toggleChessboard = () => {
    setUseReactChessboard((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={toggleChessboard}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {useReactChessboard ? 'Switch to HTML Chessboard' : 'Switch to React Chessboard'}
      </button>

      {useReactChessboard ? (
        <>
          <div className="mb-4 text-xl font-bold">
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn
          </div>
          <div className="grid grid-cols-8 gap-px bg-gray-700">
            {board.map((row, rowIndex) => (
              row.map((piece, colIndex) => {
                const isSelected = selectedPiece && 
                  selectedPiece[0] === rowIndex && 
                  selectedPiece[1] === colIndex;
                const isLight = (rowIndex + colIndex) % 2 === 0;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-16 h-16 flex items-center justify-center text-4xl
                      cursor-pointer transition-colors
                      ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                      ${isSelected ? 'bg-blue-300' : ''}
                      hover:bg-blue-200
                    `}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {getPieceSymbol(piece)}
                  </div>
                );
              })
            ))}
          </div>
          {gameOver && (
            <div className="mt-4 text-2xl font-bold text-red-600">
              Game Over!
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100%', height: '100vh' }}>
          <iframe
            src="/human-vs-human.html"
            title="Human vs Human Chess Game"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default ChessGame;
