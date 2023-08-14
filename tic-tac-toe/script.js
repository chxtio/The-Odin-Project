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
    if (gameboard.updateBoard(row, col, currPlayer.value)) {
      switchPlayerTurn();
    }
  };

  const resetGame = () => {
    gameboard.clearBoard();
    if (currPlayer.value === "O") {
      currPlayer.value = "X";
    }
  };

  function winner(board) {
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

  const terminal = (board) => {
    if (winner(board)) {
      // console.log("winner: " + winner(board));
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

  const actions = (board) => {
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    return emptyCells;
  };

  /* ----------------Minimax logic--------------- */
  const copyBoard = (board) => {
    return board.map((row) => [...row]);
  };

  const isValidMove = (board, action) => {
    const available_actions = actions(board);
    return available_actions.some(
      (availableAction) =>
        availableAction.row === action.row && availableAction.col === action.col
    );
  };

  const result = (board, action, isMax) => {
    if (!isValidMove(board, action)) {
      throw new Error("Invalid move: " + action);
      console.log("Invalid move");
    } else {
      const boardCopy = copyBoard(board);
      const player = isMax ? "X" : "O";
      boardCopy[action.row][action.col] = player;
      return boardCopy;
    }
  };

  const utility = (board) => {
    const whoWon = winner(board);
    if (whoWon === "X") return 1;
    if (whoWon === "O") return -1;
    return 0;
  };

  const maxVal = (board, alpha, beta) => {
    if (terminal(board)) {
      return utility(board);
    }

    let val = -Infinity;
    for (const action of actions(board)) {
      val = Math.max(val, minVal(result(board, action, true)));
      // Perform alpha-beta pruning
      if (val >= beta) {
        return val;
      }
    }

    return val;
  };

  const minVal = (board, alpha, beta) => {
    if (terminal(board)) {
      return utility(board);
    }

    let val = Infinity;
    for (const action of actions(board)) {
      val = Math.min(val, maxVal(result(board, action, false), alpha, beta));
      // Perform alpha-beta pruning
      if (val <= alpha) {
        return val;
      }
    }

    return val;
  };

  const miniMax = (board) => {
    if (terminal(board)) return null;

    let bestMove;

    const player = getCurrPlayer().value;
    if (player === "X") {
      let bestVal = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      for (const action of actions(board)) {
        const s_prime = result(board, action, true);
        // console.log("s_prime: " + s_prime);
        const val = minVal(s_prime);
        // console.log("action: " + action.row + " " + action.col);
        // console.log("\tval: " + val);
        if (val > bestVal) {
          bestVal = val;
          bestMove = { row: action.row, col: action.col };
          // console.log("\tupdated bestVal: " + bestVal);
          // console.log(`\tupdated bestMove: ${bestMove.row} ${bestMove.col}`);
        }
        alpha = Math.max(alpha, bestVal);
      }
    } else {
      let bestVal = Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      for (const action of actions(board)) {
        const s_prime = result(board, action, false);
        const val = maxVal(s_prime);
        // console.log("action: " + action.row + " " + action.col);
        // console.log("\tval: " + val);
        if (val < bestVal) {
          bestVal = val;
          bestMove = { row: action.row, col: action.col };
          // console.log("\tupdated bestVal: " + bestVal);
          // console.log(`\tupdated bestMove: ${bestMove.row} ${bestMove.col}`);
        }
        beta = Math.min(beta, bestVal);
      }
    }

    // console.log(`bestMove: ${bestMove.row} ${bestMove.col}`);
    return bestMove;
  };

  /* ----------------Player moves--------------- */
  const getRandomMove = (board) => {
    const emptyCells = actions(board);
    if (emptyCells.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  };

  const computerPlay = () => {
    // const move = getRandomMove(board);
    const board = gameboard.getBoard();
    const move = miniMax(board);
    playRound(move.row, move.col);
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
  // console.log(board);

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
      winDiv.textContent = "Player 1 wins!";
    } else if (winner === "O") {
      winDiv.textContent = "Computer wins!";
    } else {
      winDiv.textContent = "Tie!";
    }
    console.log("Game over!");
  };

  const checkMove = (e) => {
    const board = game.getBoard();
    const row = e.target.dataset.rowInd;
    const col = e.target.dataset.colInd;
    const currPlayer = game.getCurrPlayer();
    const gameOver = game.terminal(board);

    if (!gameOver && currPlayer.value === "X") {
      game.humanPlay(row, col);
      updateScreen();
    } else if (!gameOver && currPlayer.value === "O") {
      game.computerPlay();
      setTimeout(() => {
        updateScreen();
      }, 0);
    } else {
      displayWin(game.winner(board));
    }

    if (game.terminal(board)) {
      // console.log("Game over!");
      displayWin(game.winner(board));
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
