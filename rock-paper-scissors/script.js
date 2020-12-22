let player = 0;
let computer = 0;

const userScore = document.getElementById("user-score");
const compScore = document.getElementById("computer-score");
const userPlus = document.getElementById("u-oneup");
const compPlus = document.getElementById("p-oneup");
const userBtns = document.querySelectorAll(".choices button");
const result = document.getElementById("result-test");
const resetBtn = document.getElementById("reset-button");

function computerPlay() {
  const choices = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function game(playerSelection) {
  const computerSelection = computerPlay();
  const userChoiceDiv = document.getElementById(playerSelection);
  const userProper =
    playerSelection.charAt(0).toUpperCase() + playerSelection.substring(1);
  const pcProper =
    computerSelection.charAt(0).toUpperCase() + computerSelection.substring(1);

  if (playerSelection == computerSelection) {
    console.log("Tie!");
    result.innerHTML = "It's a Tie!";
    result.style.color = "orange";
    userChoiceDiv.classList.add("orange-glow");
    setTimeout(function () {
      userChoiceDiv.classList.remove("orange-glow");
    }, 600);
    userPlus.style.visibility = "hidden";
    compPlus.style.visibility = "hidden";
  } else if (
    (playerSelection === "rock" && computerSelection === "scissors") ||
    (playerSelection === "paper" && computerSelection === "rock") ||
    (playerSelection === "scissors" && computerSelection === "paper")
  ) {
    console.log("You win!");
    result.innerHTML = "You win! " + userProper + " beats " + pcProper;
    result.style.color = "green";
    userChoiceDiv.classList.add("green-glow");
    setTimeout(function () {
      userChoiceDiv.classList.remove("green-glow");
    }, 600);
    userPlus.style.visibility = "visible";
    compPlus.style.visibility = "hidden";
    setTimeout(() => (userPlus.style.visibility = "hidden"), 1000);
    player++;
  } else if (
    (playerSelection === "scissors" && computerSelection === "rock") ||
    (playerSelection === "rock" && computerSelection === "paper") ||
    (playerSelection === "paper" && computerSelection === "scissors")
  ) {
    console.log("You lost!");
    result.innerHTML = "You lost! " + pcProper + " beats " + userProper;
    result.style.color = "red";
    userChoiceDiv.classList.add("red-glow");
    setTimeout(function () {
      userChoiceDiv.classList.remove("red-glow");
    }, 600);
    compPlus.style.visibility = "visible";
    userPlus.style.visibility = "hidden";
    setTimeout(function () {
      compPlus.style.visibility = "hidden";
    }, 1000);
    computer++;
  }
  userScore.innerHTML = player;
  compScore.innerHTML = computer;

  if (player == 5) {
    result.innerHTML = "Game Over. You Won!";
    reset();
  } else if (computer == 5) {
    result.innerHTML = "Game Over. You Lost.";
    reset();
  }

  function reset() {
    userBtns.forEach((btn) => {
      btn.disabled = true;
    });
    resetBtn.style.visibility = "visible";
  }
}

function main() {
  userBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      let choice = e.target.parentNode.id;
      game(choice);
    });
  });

  resetBtn.addEventListener("click", function () {
    player = 0;
    computer = 0;
    userScore.innerHTML = player;
    compScore.innerHTML = computer;
    userBtns.forEach((btn) => (btn.disabled = false));
    resetBtn.style.visibility = "hidden";
    result.innerHTML = "Make your move";
    result.style.color = "white";
  });
}

main();
