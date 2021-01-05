// Functions for previous simple Calculator
let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;
let operate = (operator, x, y) => operator(x, y);

/*
console.log(operate(add, 5, 7));
console.log(operate(subtract, 7, 2));
console.log(operate(multiply, 7, 2));
console.log(operate(divide, 7, 2));
*/

// Stack based Calculator
const keyBtns = document.querySelectorAll("button");
const displayTitle = document.getElementById("answer-title");
let displayValue = "0";
let inputString = "";
let answer = "";
let converted = "";
let pos = true;
let per = false;

window.addEventListener("keydown", function (e) {
  const key = document.querySelector(`button[data-key='${e.keyCode}']`);
  key.click();
});

function updateDisplay() {
  const display = document.getElementById("express");
  if (inputString === "") {
    display.innerText = "0";
  } else {
    display.innerText = inputString;
  }
}

function displayOutput() {
  const displayRPN = document.getElementById("answer-left");
  const displayAnswer = document.getElementById("answer-right");
  if (answer === "") {
    displayRPN.innerText = "";
    displayAnswer.innerText = "";
    displayRPN.style.color = "orange";
    displayTitle.style.color = "orange";
  } else {
    let evaluated = reversePolish(converted);
    //let output = evaluated.toString().substring(0, 9);
    let output = roundAccurately(evaluated, 15).toString().substring(0, 9);
    console.log("evaluated: " + evaluated);
    console.log("output: " + output);
    if (per) {
      displayTitle.innerText = "🤖 postfix";
      answer = infixToReversePolish(evaluated + " / 100");
      displayRPN.innerText = answer;
      evaluated /= 100;
      displayAnswer.innerText = evaluated;
      per = false;
      return;
    }
    displayRPN.innerText = answer;

    if (isNaN(reversePolish(converted))) {
      displayAnswer.innerText = "Syntax Error";
      displayRPN.style.color = "red";
      displayTitle.style.color = "red";
    } else if (evaluated === Infinity) {
      console.log("Reached infinity");
      displayAnswer.innerText = "Error";
      displayRPN.style.color = "red";
      displayTitle.style.color = "red";
    } else {
      displayAnswer.innerText = output;
    }
    displayTitle.innerText = "🤖 postfix";
  }
}

updateDisplay();
displayOutput();

function reversePolish(input) {
  const stack = [];
  const expression = input.split(" ");
  console.log(expression);
  for (let i = 0; i < expression.length; i++) {
    switch (expression[i]) {
      case "+":
        stack.push(stack.pop() + stack.pop());
        break;
      case "-":
        stack.push(-stack.pop() + stack.pop());
        break;
      case "*":
        stack.push(stack.pop() * stack.pop());
        break;
      case "/":
        stack.push((1 / stack.pop()) * stack.pop());
        break;
      default:
        stack.push(parseFloat(expression[i]));
    }
    console.log(stack);
  }
  return stack.pop();
}

function infixToReversePolish(input) {
  const stack = [];
  let polish = "";
  const expression = input.split(" ");
  for (let i = 0; i < expression.length; i++) {
    console.log(stack);
    switch (expression[i]) {
      case "+":
        if (
          stack.length >= 1 &&
          (stack[stack.length - 1] === "*" || stack[stack.length - 1] === "/")
        ) {
          console.log("encountered +, popping");
          polish += stack.pop() + " ";
          stack.push("+");
        } else if (stack.length >= 1) {
          polish += stack.pop() + " ";
          stack.push("+");
        } else {
          stack.push("+");
        }
        break;
      case "-":
        if (
          stack.length >= 1 &&
          (stack[stack.length - 1] === "*" || stack[stack.length - 1] === "/")
        ) {
          polish += stack.pop() + " ";
          stack.push("-");
        } else if (stack.length >= 1) {
          polish += stack.pop() + " ";
          stack.push("-");
        } else {
          stack.push("-");
        }
        break;
      case "*":
        if (
          stack.length >= 1 &&
          (stack.length < 1 ||
            stack[stack.length - 1] === "*" ||
            stack[stack.length - 1] === "/")
        ) {
          polish += stack.pop() + " ";
          stack.push("*");
        } else {
          stack.push("*");
        }
        break;
      case "/":
        if (
          stack.length >= 1 &&
          (stack.length < 1 ||
            stack[stack.length - 1] === "*" ||
            stack[stack.length - 1] === "/")
        ) {
          polish += stack.pop() + " ";
          stack.push("/");
        } else {
          stack.push("/");
        }
        break;
      default:
        polish += expression[i] + " ";
    }
  }
  while (stack.length) {
    polish += stack.pop() + " ";
  }
  return polish.substring(0, polish.length - 1);
}

function processInput(e) {
  const type = e.target.className;
  const key = e.target.value;
  //console.log(`${type} | ${key}`);
  if (answer !== "") {
    clear();
  }
  if (key === "clear") {
    clear();
  } else if (key === "percent") {
    per = true;
    converted = infixToReversePolish(inputString);
    answer = converted;
    displayOutput();
  } else if (key === "=") {
    converted = infixToReversePolish(inputString);
    answer = converted;
    displayOutput();
  } else if (type === "operator") {
    inputString += " " + key + " ";
  } else if (type === "sign") {
    pos = !pos;
    if (pos) {
      if (inputString.charAt(inputString.length - 1) === "-") {
        inputString = inputString.slice(0, -1);
      }
    } else {
      inputString += "-";
      if (inputString.charAt(inputString.length - 2) !== " ") {
        displayTitle.innerText = "😉 postfix";
        setTimeout(function () {
          inputString = inputString.slice(0, -1);
          updateDisplay();
          displayTitle.innerText = "🤖 postfix";
        }, 800);
      }
    }
  } else {
    inputString += key;
    pos = true;
  }
  updateDisplay();
}

function clear() {
  displayValue = "0";
  inputString = "";
  answer = "";
  converted = "";
  updateDisplay();
  displayOutput();
}

function roundAccurately(num, places) {
    return parseFloat(Math.round(num + 'e' + places) + 'e-' + places);
}

keyBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    processInput(e);
  });
});