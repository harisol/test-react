import React from "react";

const defaultState = {
  squares: Array(9).fill(null),
  xIsNext: true
};

// Function Component: component that doesn't have their own state
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Regular component
class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  resetGame() {
    if (!calculateWinner(this.state.squares)) {
      if (!window.confirm('Game will reset. Continue?')) {
        return;
      }
    }

    this.setState(defaultState);
  }

  handleClick(i) {
    // copy the existing squares array first, instead of modifying the existing array directly
    const squares = this.state.squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      // ignore click if square already filled or if someone has won the game
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    const winner = calculateWinner(this.state.squares);
    if (winner) {
      status = 'Winner: ' + winner;
    }
    return (
      <div id="tictactoe-game">
        <h1>Tic Tac Toe</h1>
        <div className="game">
          <div className="game-board">
            <div className="status">{status}</div>
            <Board
              squares={this.state.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>
              <button onClick={() => this.resetGame()}>New Game</button>
            </div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;