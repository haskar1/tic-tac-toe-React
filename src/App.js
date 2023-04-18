import React, { useState } from "react";

function Square({ className, value, onSquareClick }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay, currentMove, winningSquares, handleWinningSquares, handleTileIndex }) {  
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
    displayStatus();
    highlightWinningSquares(nextSquares);
    handleTileIndex(i);
  }

  function highlightWinningSquares(nextSquares) {
    const nextWinner = calculateWinner(nextSquares)
    if (nextWinner) {
      handleWinningSquares(calculateWinningSquares(nextSquares));
    }
  }

  function displayStatus() {
    const winner = calculateWinner(squares);
    let status;
    if (winner === 'X' || winner === 'O') {
      status = winner + " is the winner!";
    } 
    else if (currentMove === 9) {
      status = "It's a tie!";
    }
    else {
      status = "Next player: " + (xIsNext ? 'X' : 'O');
    }
    return status;
  }

  function calculateWinner(squares) {
    const list = [
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8], 
      [0, 4, 8], 
      [2, 4, 6]
    ];
  
    for (let i = 0; i < list.length; i++) {
      const [a, b, c] = list[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function calculateWinningSquares(squares) {
    const list = [    
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8], 
      [0, 4, 8], 
      [2, 4, 6]
    ];
  
    for (let i = 0; i < list.length; i++) {
      const [a, b, c] = list[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return [];
  }
  
  // Generate board tiles
  const rows = [];  

  for (let i = 0; i < 9; i += 3) {
    const squareRow = generateSquares(i);
    rows.push(<div className="board-row">{squareRow}</div>);
  }
  
  function generateSquares(i) {
    const squareArray = [];

    for (let j = i; j < (i + 3); j++) {
      let className = 'square';

      if (winningSquares.includes(j)) {
        className += ' winning-square';
      } else {
        className = 'square';
      }

      squareArray.push(
        <Square className={className} value={squares[j]} onSquareClick={() => handleClick(j)} />
      );
    }

    return squareArray;
  }

  return (
    <>
      <div className="status">{displayStatus()}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isAscending, setIsAscending] = useState(true);
  const [winningSquares, setWinningSquares] = useState([]);
  const [prevCalculatedWinners, setPrevCalculatedWinners] = useState([]);
  const [currentTileIndex, setCurrentTileIndex] = useState([null]);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  let currentMoveDescription;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleWinningSquares(calculatedWinners) {
    setWinningSquares(calculatedWinners);
    setPrevCalculatedWinners(calculatedWinners);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  
    if (nextMove === moveButtons.length - 1) {
      setWinningSquares(prevCalculatedWinners);
    } else {
      setWinningSquares([]);
    }
  }

  function handleNewGame() {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
    setWinningSquares([]);
    setPrevCalculatedWinners([]);
    setCurrentTileIndex([null])
  }

  function handleTileIndex(index) {
    const nextTileIndex = [...currentTileIndex.slice(), index];
    setCurrentTileIndex(nextTileIndex);
  }

  const moves = history.map((squares, move) => {
    let buttonDescription;

    if (move === 1 && move === currentMove) {
      currentMoveDescription = `You made ${move} move`;
    } else if (move > 0 && move === currentMove) {
      currentMoveDescription = `You made ${move} moves`;
    } 
    
    if (move > 0) {
      const [row, col] = getRowAndCol(currentTileIndex[move]);

      buttonDescription = `Go to move #${move}. (Row ${row}, Column ${col})`;
    }

    return {
      move,
      buttonDescription
    };
  });
  
  function getRowAndCol(index) {
    let row;
    let col;

    if (index === 0 || index === 1 || index === 2) {
      row = 1;
    } else if (index === 3 || index === 4 || index === 5) {
      row = 2;
    } else {
      row = 3;
    }

    if (index === 0 || index === 3 || index === 6) {
      col = 1;
    } else if (index === 1 || index === 4 || index === 7) {
      col = 2;
    } else {
      col = 3;
    }

    return [row, col];
  }

  if (!isAscending) {
    moves.reverse();
  }


  const moveButtons = moves.map(({ move, buttonDescription }) => {
    if (move === 0) {
      return;
    }


    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{buttonDescription}</button>
      </li>
    )
  });

  function handleSortToggle() {
    setIsAscending(!isAscending);
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          currentMove={currentMove} 
          winningSquares={winningSquares} 
          handleWinningSquares={handleWinningSquares} 
          handleTileIndex={handleTileIndex} 
        /> 
        <div>
          {currentMoveDescription}
        </div>
      </div>

      <div className="game-info">
        <button onClick={handleSortToggle}>{isAscending ? 'Sort Descending' : 'Sort Ascending'}</button>
        <button onClick={handleNewGame}>New Game</button>
        <ul>{moveButtons}</ul>
      </div>
    </div>
  )
}