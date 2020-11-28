/** history button list */
function HistoryList(props) {
  const moves = props.history.map((timing, move) => {
    const text = move ?
      'Go to move #' + move :
      'Go to Start';
    return (
      <li key={move}>
        <button onClick={() => props.onClick(move)}>
          {text}
        </button>
      </li>
    )
  });
  return <ol>{moves}</ol>
}

export default HistoryList;