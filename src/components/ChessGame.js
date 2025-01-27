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

 const isValidMove = (from, to) => {
   const [fromRow, fromCol] = from;
   const [toRow, toCol] = to;
   const piece = board[fromRow][fromCol];
   const targetPiece = board[toRow][toCol];
   
   if (targetPiece !== '') {
     const isCurrentPlayerPiece = currentPlayer === 'white' ? 
       targetPiece === targetPiece.toUpperCase() : 
       targetPiece === targetPiece.toLowerCase();
     if (isCurrentPlayerPiece) return false;
   }
   return true;
 };

 const handleSquareClick = useCallback((row, col) => {
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
 }, [board, selectedPiece, currentPlayer]);

 const getPieceSymbol = (piece) => {
   const symbols = {
     'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙',
     'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟'
   };
   return symbols[piece] || '';
 };

 return (
   <div className="flex flex-col items-center p-4">
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
   </div>
 );
};

export default ChessGame;
