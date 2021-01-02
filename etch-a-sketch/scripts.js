const grid = document.querySelector(".grid-container");
const sizeBtns = document.querySelectorAll(".size-buttons");
const colorBtns = document.querySelectorAll(".pen-color-btns");
const colorPicker = document.querySelector("#colorpicker");
var color = "#424242";

function makeGrid(n = 16) {
  grid.style.setProperty("--grid-rows", n);
  grid.style.setProperty("--grid-cols", n);
  for (let i = 0; i < n * n; i++) {
    //console.log('creating squarediv: ', i);
    const div = document.createElement("div");
    let divWidth = getWidth(n);
    div.classList.add("grid-items");
    div.style.setProperty("--items-width", divWidth);
    //div.style.setProperty("background-color", "red");
    //div.innerHTML = `${i + 1}`;
    grid.appendChild(div);
  }
}

function getWidth(n) {
  let width = "10px";
  switch (n) {
    case 10:
      width = "47px";
      break;
    case 20:
      width = "23px";
      break;
    case 30:
      width = "15px";
      break;
  }

  return width;
}

function main() {
  makeGrid(20);

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const itemDivs = document.querySelectorAll(".grid-items");
      itemDivs.forEach((div) => {
        div.remove();
      });
      let choice = parseInt(btn.id.substring(5), 10);
      makeGrid(choice);
    });
  });
}

colorBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // Send chosen color
    changeColor(e.target.id);
  });
});

function changeColor(choice) {
  console.log(choice);
  if (choice == "rainbow") {
    console.log("to do");
    color = "rgb";
  } else if (choice == "eraser") {
    color = "#8A0651";
  } else if (choice == "blue") {
    color = "#26267E";
  } else {
    color = "choice";
  }
}

grid.addEventListener("mouseover", function (e) {
  if (color == "rgb") {
    e.target.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  } else {
    e.target.style.backgroundColor = color;
  }
});

colorPicker.addEventListener(
  "change",
  function (e) {
    console.log("change " + e.target.value);
    color = e.target.value;
  },
  false
);

colorPicker.addEventListener(
  "input",
  function (e) {
    console.log("pick " + e.target.value);
    color = e.target.value;
  },
  false
);

main();
