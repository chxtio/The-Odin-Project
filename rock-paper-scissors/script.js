let choices = ["rock", "paper", "scissors"];
let player = 0;
let computer = 0;

function computerPlay() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return "Tie!";
  } else if (playerSelection === "rock") {
    if (computerSelection === "scissors") {
      player++;
      return "You win! Rock beats Scissors";
    } else {
      computer++;
      return "You lose! Paper beats Rock";
    }
  } else if (playerSelection === "paper") {
    if (computerSelection === "rock") {
      player++;
      return "You win! Paper beats Rock";
    } else {
      computer++;
      return "You lose! Scissors beats Paper";
    }
  } else if (playerSelection === "scissors") {
    if (computerSelection === "rock") {
      computer++;
      return "You lose! Rock beats Scissors";
    } else {
      player++;
      return "You win! Scissors beats Paper";
    }
  }
}

function game() {
  for (let i = 0; i < 5; i++) {
    const computerSelection = computerPlay();
    do {
      var error = 0;
      var playerSelection = prompt(
        "Choose rock, paper, scissors"
      ).toLowerCase();
      try {
        if (!choices.includes(playerSelection)) throw "Invalid selection.";
      } catch (err) {
        console.log("Error: " + err);
        error = 1;
      }
    } while (error);
    
    console.log("Round " + (i + 1));
    console.log(playRound(playerSelection, computerSelection));
    console.log("Score: " + player + " - " + computer);
  }
  
  if (player > computer) {
    return "YOU WON!";
  } else if (player < computer) {
    return "GAME OVER. You lose.";
  } else {
    return "TIE.";
  }
}

do {
  const winner = game();
  console.log(winner);
  // Reset scores
  player = 0;
  computer = 0;
  var input = prompt("Play again? y/n");
} while (input !== 'n');
