import Game from './components/Game';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * @boardSize the side length of game board
 * @winTarget the length of chain for win
 * standard Gomoku should be [15, 5] or [19, 5]
 */
const [boardSize, winTarget] = [15, 5];

ReactDOM.render(
  <Game
    boardSize={boardSize}
    winTarget={winTarget}
  />,
  document.getElementById('root')
);

