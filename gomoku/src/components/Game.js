import HistoryList from './HistoryList';
import Board from './Board';
import React, { useState } from 'react';

function Game(props) {

  // ===========================================================================
  // state
  // ===========================================================================

  /** history-list for "time travel" */
  const [history, setHistory] = useState([{
    /**
     * an one-dimensional list, 
     * record the information of board for a certain timing.
     * null for the square without any kind of piece on it
     */
    squares: Array(props.boardSize ** 2).fill(null),
  }]);

  /** current step, also used for the index of history-list */
  const [step, setStep] = useState(0);

  /** whose turn */
  const [blackIsNext, setBlackIsNext] = useState(true);

  /** winner. null for nobody wins */
  const [winner, setWinner] = useState(null);

  // ===========================================================================
  // functions
  // ===========================================================================

  /**
   * process after the square-button pressed
   * @i No. of the square pressed, 
   *    which means the location of new piece
   */
  const handleClick = i => {
    /** after going back to the past, throw away all the “new future” */
    const curHistory = history.slice(0, step + 1);

    /** get the new squares at current timing */
    const squares = curHistory[step].squares.slice();

    /** if winner occurs, game should be over */
    if (winner || squares[i]) return;

    /** place a new piece */
    squares[i] = blackIsNext ? '●' : '○';
    setHistory(curHistory.concat([{
      squares: squares,
    }]));

    /** change status */
    setStep(curHistory.length);
    setWinner(calculateWinner(squares, i));
    setBlackIsNext(!blackIsNext);
  }

  /** process time travel */
  const jumpTo = targetStep => {
    console.log(`jump from #${step} to #${targetStep}`);
    setStep(targetStep);
    setBlackIsNext((targetStep % 2) === 0);

    /** after going back to the past, reset the winner */
    if (targetStep < step) setWinner(null);
  }

  /**
   * judge the winner
   * @index the index of new-piece in squares list
   */
  function calculateWinner(squares, index) {
    /** from index to coordinate */
    const [x0, y0] = index2xy(index);

    /** which kind the new-piece is */
    const piece = squares[index];
    console.log(`#${step + 1} : ${piece} @(${x0}, ${y0})`);

    /** the length of longest chain include new-piece */
    let maxLength = 1;

    /** through the 4 directions, calculate the length of chain */
    const directList = [[0, 1], [1, 0], [1, 1], [1, -1]];
    directList.forEach(direct => {
      /** length through this direction */
      let length = 0;

      /** coordinate of pointer */
      let [x, y] = [x0, y0];

      /** through one side of this direction */
      while (x >= 1 && x <= props.boardSize && y >= 1 && y <= props.boardSize) {
        if (squares[xy2index(x, y)] === piece) {
          x += direct[0];
          y += direct[1];
          length++;
        } else break;
      }

      /** reset pointer, don't point the new-piece twice */
      [x, y] = [x0, y0];
      length--;

      /** through another side of this direction */
      while (x >= 1 && x <= props.boardSize && y >= 1 && y <= props.boardSize) {
        if (squares[xy2index(x, y)] === piece) {
          x -= direct[0];
          y -= direct[1];
          length++;
        } else break;
      }
      maxLength = (length > maxLength) ? length : maxLength;
    });

    /** player wins? */
    return maxLength >= props.winTarget ? piece : null;
  }

  /** convert the 1D-index and 2D-coordinate of piece */
  const index2xy = index => [index % props.boardSize + 1, parseInt(index / props.boardSize) + 1]
  const xy2index = (col, row) => (row - 1) * props.boardSize + col - 1

  /** a sentence to show the status */
  let statusText = winner ?
    `Winner: ${winner}` :
    `Next player: ${blackIsNext ? '●' : '○'}`;

  // ===========================================================================
  // template
  // ===========================================================================

  return (
    <div className="game">
      <div className="game-board">
        <Board
          boardSize={props.boardSize}
          squares={history[step].squares}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{statusText}</div>
        <HistoryList
          history={history}
          onClick={move => jumpTo(move)}
        />
      </div>
    </div>
  )
}

export default Game;