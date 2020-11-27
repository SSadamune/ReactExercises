import Square from './Square'

/** Board component */
function Board(props) {
  /** how many squares rendered */
  let squareNum = 0;

  /** render squares */
  const renderSquare = i => (
    <Square key={i}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );

  let board = [];
  /** render board */
  for (let i = 0; i < props.boardSize; i++) {
    let row = [];
    /** render row of board */
    for (let j = 0; j < props.boardSize; j++) {
      row.push(renderSquare(squareNum));
      squareNum++;
    }
    board.push(
      <div key={i} className="board-row">{row}</div>
    );
  }
  return (
    <div>{board}</div>
  )
}

export default Board;