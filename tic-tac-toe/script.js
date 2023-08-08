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

// // player factory
// const Player = (value) => {
//   let _value = value;
//   const getValue = function () {
//     return _value;
//   };
//   return { getValue };
// };

const Player = (value) => {
  return { value: value };
};

// // Game controller module
// const GameController (() => {
//   return {};
// })();

// Display Controller module
const DisplayController = (() => {
  const game = Gameboard;
  const board = game.getBoard();
  const currPlayer = Player("X");
  // console.log(board);
  console.log("test");
  const uiBoard = document.querySelector(".board");

  board.forEach((row, rowInd) => {
    row.forEach((cell, colInd) => {
      // console.log(cell, col);
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.dataset.rowInd = rowInd;
      cellDiv.dataset.colInd = colInd;

      cellDiv.addEventListener("click", () => {
        const row = cellDiv.dataset.rowInd;
        const col = cellDiv.dataset.colInd;
        const value = currPlayer.value;
        // console.log("value: " + value);
        if (game.updateBoard(row, col, value)) {
          cellDiv.textContent = value;
          if (currPlayer.value === "X") {
            currPlayer.value = "O";
          } else {
            currPlayer.value = "X";
          }
        }
      });

      uiBoard.appendChild(cellDiv);
    });
  });

  // return {};
})();
