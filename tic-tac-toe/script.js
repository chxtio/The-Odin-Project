// gameboard module
const Gameboard = (() => {
  let gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  const getBoard = () => gameboard;

  const updateBoard = (row, col, value) => {
    if (gameboard[row][col]) {
      return false;
    }
    gameboard[row][col] = value;
    return true;
  };

  const clearBoard = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard.length; j++) {
        gameboard[i][j] = "";
      }
    }
  };

  return { getBoard, updateBoard, clearBoard };
})();

// player factory
const Player = (value) => {
  return { value: value };
};

// Game controller module
const GameController = (() => {
  const gameboard = Gameboard;
  const board = gameboard.getBoard();
  const currPlayer = Player("X");
  const getCurrPlayer = () => currPlayer;
  const switchPlayerTurn = () => {
    if (currPlayer.value === "X") {
      currPlayer.value = "O";
    } else {
      currPlayer.value = "X";
    }
  };

  const playRound = (row, col) => {
    const value = currPlayer.value;
    // console.log("value: " + value);
    if (gameboard.updateBoard(row, col, value)) {
      console.log("board updated");
      switchPlayerTurn();
    }
  };

  const resetGame = () => {
    gameboard.clearBoard();
    if (currPlayer.value === "O") {
      currPlayer.value = "X";
    }
  };

  function winner() {
    console.log("test: ");
    console.log(board);
    // Horizontal Rows
    for (let r = 0; r < board.length; r++) {
      if (board[r][0] === "X" && board[r][1] === "X" && board[r][2] === "X") {
        return "X";
      }
      if (board[r][0] === "O" && board[r][1] === "O" && board[r][2] === "O") {
        return "O";
      }
      // Vertical Rows
      const c = r;
      if (board[0][c] === "X" && board[1][c] === "X" && board[2][c] === "X") {
        return "X";
      }
      if (board[0][c] === "O" && board[1][c] === "O" && board[2][c] === "O") {
        return "O";
      }
    }

    // Diagonal
    if (board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") {
      return "X";
    }
    if (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O") {
      return "O";
    }

    if (board[2][0] === "X" && board[1][1] === "X" && board[0][2] === "X") {
      return "X";
    }
    if (board[2][0] === "O" && board[1][1] === "O" && board[0][2] === "O") {
      return "O";
    }

    return null;
  }

  const terminal = () => {
    if (winner()) {
      console.log("winner: " + winner());
      return true;
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  };

  const getRandomMove = () => {
    const emptyCells = [];
    const board = gameboard.getBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    if (emptyCells.length === 0) {
      return null; // No valid move available
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  };

  const computerPlay = () => {
    const randomMove = getRandomMove();
    playRound(randomMove.row, randomMove.col);
  };

  const humanPlay = (row, col) => {
    playRound(row, col);
  };

  return {
    getCurrPlayer,
    playRound,
    getBoard: gameboard.getBoard,
    resetGame,
    winner,
    terminal,
    computerPlay,
    humanPlay
  };
})();

// Display Controller module
const DisplayController = (() => {
  const game = GameController;
  const uiBoard = document.querySelector(".board");
  const restartButton = document.getElementById("restart-button");
  console.log(board);

  const updatePlayerTiles = (currPlayer) => {
    const player1Tile = document.getElementById("player-1");
    const playerBotTile = document.getElementById("player-bot");
    if (currPlayer.value === "X") {
      player1Tile.classList.add("active-player");
      playerBotTile.classList.remove("active-player");
    } else {
      playerBotTile.classList.add("active-player");
      player1Tile.classList.remove("active-player");
    }
  };

  const updateScreen = () => {
    const board = game.getBoard();
    const currPlayer = game.getCurrPlayer();
    updatePlayerTiles(currPlayer);

    // Clear the board
    uiBoard.textContent = "";
    // Populate the board with marked values
    board.forEach((row, rowInd) => {
      row.forEach((cell, colInd) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.classList.add("glow");
        cellDiv.textContent = cell;
        cellDiv.dataset.rowInd = rowInd;
        cellDiv.dataset.colInd = colInd;
        uiBoard.appendChild(cellDiv);
      });
    });
  };

  const displayWin = (winner) => {
    const winDiv = document.getElementById("win-status");
    if (winner === "X") {
      winDiv.textContent = "Player 1 wins";
    } else if (winner === "O") {
      winDiv.textContent = "Computer wins";
    } else {
      winDiv.textContent = "Tie";
    }
    console.log("Game over!");
  };

  const checkMove = (e) => {
    const row = e.target.dataset.rowInd;
    const col = e.target.dataset.colInd;
    const currPlayer = game.getCurrPlayer();
    const gameOver = game.terminal();

    if (!gameOver && currPlayer.value === "X") {
      game.humanPlay(row, col);
      updateScreen();
    } else if (!gameOver && currPlayer.value === "O") {
      game.computerPlay();
      updateScreen();
    } else {
      displayWin(game.winner());
    }

    if (game.terminal()) {
      // console.log("Game over!");
      displayWin(game.winner());
    }
  };

  // Add event listener for the board
  uiBoard.addEventListener("click", (e) => {
    // game.playRound(row, col);
    checkMove(e);
    checkMove(e);
  });

  // Add event listener for the restart buton
  restartButton.addEventListener("click", (e) => {
    const winDiv = document.getElementById("win-status");
    winDiv.textContent = "";
    game.resetGame();
    updateScreen();
  });

  // Initial render
  updateScreen();
})();

DisplayController;
