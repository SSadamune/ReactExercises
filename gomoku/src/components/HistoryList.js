/** history button list */
function HistoryList(props) {
  const moves = props.history.map((step, move) => {
    /** words on button */
    const desc = move ?
      'Go to move #' + move :
      'Go to Start';
    return (
      <li key={move}>
        <button onClick={() => props.onClick(move)}>
          {desc}
        </button>
      </li>
    )
  });
  return <ol>{moves}</ol>
}

export default HistoryList;