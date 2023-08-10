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
      // cellDiv.textContent = value;
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

  return { getCurrPlayer, playRound, getBoard: gameboard.getBoard, resetGame };
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

  // Add event listener for the board
  uiBoard.addEventListener("click", (e) => {
    const row = e.target.dataset.rowInd;
    const col = e.target.dataset.colInd;
    game.playRound(row, col);
    updateScreen();
  });

  // Add event listener for the restart buton
  restartButton.addEventListener("click", (e) => {
    // uiBoard.textContent = "";
    game.resetGame();
    updateScreen();
  });

  // Initial render
  updateScreen();
})();

DisplayController;
