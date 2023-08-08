// gameboard module
const Gameboard = (() => {
  let gameboard = [
    ["X", "O", "X"],
    ["O", "X", ""],
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

  return { getBoard, updateBoard };
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
    }
    switchPlayerTurn();
  };

  return { getCurrPlayer, playRound, getBoard: gameboard.getBoard };
})();

// Display Controller module
const DisplayController = (() => {
  const game = GameController;
  const uiBoard = document.querySelector(".board");
  console.log(board);

  const updateScreen = () => {
    const board = game.getBoard();
    const currPlayer = game.getCurrPlayer();
    // Clear the board
    uiBoard.textContent = "";
    board.forEach((row, rowInd) => {
      row.forEach((cell, colInd) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
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

  // Initial render
  updateScreen();
})();

DisplayController;
