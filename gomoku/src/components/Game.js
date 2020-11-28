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
     * @squareList a one-dimensional list, 
     *    record the pieces on board for a certain timing,
     *    null for the square without piece on it.
     * @newPieceIndex the index of newest piece placed.
     */
    squareList: Array(props.boardSize ** 2).fill(null),
    lastPieceLocation: null,
  }]);

  /** current move, also used as the index of history-list */
  const [move, setMove] = useState(0);

  /** whose turn */
  const [blackIsNext, setBlackIsNext] = useState(true);

  /** who wins. null for nobody */
  const [winner, setWinner] = useState(null);

  // ===========================================================================
  // functions
  // ===========================================================================

  /**
   * process after the square-button pressed
   * @i index of the square pressed, 
   *    which means the location of new piece
   */
  const handleClick = i => {
    /** 
     * after going back to the past, and place a piece
     * the "history"(future) should be changed
     */
    const curHistory = history.slice(0, move + 1);

    /** get the new squares at current timing */
    const curSquareList = curHistory[move].squareList.slice();

    /** if winner occurs, game should be over */
    if (winner || curSquareList[i]) return;

    /** place a new piece, update squares-list */
    curSquareList[i] = blackIsNext ? '●' : '○';

    /** current timing */
    const curTiming = {
      squareList: curSquareList,
      lastPieceLocation: i,
    }

    /** change status */
    setHistory(curHistory.concat([curTiming]));
    setMove(curHistory.length);
    setWinner(calculateWinner(curTiming));
    setBlackIsNext(!blackIsNext);
  }

  /** process time travel */
  const jumpTo = targetMove => {
    console.log(`jump from #${move} to #${targetMove}`);
    setMove(targetMove);
    setBlackIsNext((targetMove % 2) === 0);
    setWinner(calculateWinner(history[targetMove]));
  }

  /**
   * judge the winner
   * @timing an element of history-list
   */
  function calculateWinner(timing) {
    /** from index to coordinate */
    const [x0, y0] = index2xy(timing.lastPieceLocation);

    /** which kind the new-piece is */
    const piece = timing.squareList[timing.lastPieceLocation];
    console.log(`#${move + 1} : ${piece} @(${x0}, ${y0})`);

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
        if (timing.squareList[xy2index(x, y)] === piece) {
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
        if (timing.squareList[xy2index(x, y)] === piece) {
          x -= direct[0];
          y -= direct[1];
          length++;
        } else break;
      }
      maxLength = (length > maxLength) ? length : maxLength;
    });

    /** Did current player win? */
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
          squares={history[move].squareList}
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