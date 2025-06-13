import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winner = result?.winner;
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const status = winner
    ? 'Winner is player ' + winner
    : isDraw
    ? "It's a draw!"
    : (xIsNext ? 'X' : 'O') + ' is playing now';

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    if (move === 0) {
      setHistory([Array(9).fill(null)]);
    }
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves =
    history.length > 1
      ? history.map((_, move) => {
          if (move === 0 || move === currentMove) return null;
          const description = 'Go to move ' + move;
          return (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
          );
        })
      : [];

  return (
    <div className="game-container">
      <div className="game-board-section">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-buttons">
          <button onClick={() => jumpTo(0)}>Go to game start</button>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </div>
      <div className="game-info">
        <h3>Move History</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
export default App
