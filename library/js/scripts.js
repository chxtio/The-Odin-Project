const container = document.querySelector("#container");
const lib_table = document.querySelector("#book_entries");
const fields = ['title', 'author', 'pages', 'status'];
const statusOptions = ["Read", "Not Read", "In Progress"];
const indexDict =  {"Read": 0, "Not Read": 1, "In Progress": 2};
const form = document.querySelector("form");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const pages = document.querySelector("#pages");
const status = document.querySelector("#status");

let deleteBtns = document.querySelectorAll(".delete-button");
let statusBtns = document.querySelectorAll(".status-button");

let myLibrary = [];

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    
    let statusIndex = status;
    this.status = statusOptions[statusIndex];
    this.info = function() {
        return `${title} by ${author}, ${pages}, ${status}`;
    }
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
    displayLibrary(newBook);

    deleteBtns = document.querySelectorAll(".delete-button");
    statusBtns = document.querySelectorAll(".status-button");

    // // Delete button clicked
    // deleteBtns.forEach((btn) => {
    //   btn.addEventListener("click", (e) => {
    //     deleteBook(e);
    //   }); 
    // });

    // // Toggle status
    // statusBtns.forEach((btn) => {
    //   btn.addEventListener("click", (e) => {
    //     toggleStatus(e);
    //   });
    // });
}

function displayLibrary(book) {
  // const fields = ['title', 'author', 'pages', 'status'];

  // for (let book of myLibrary) {
      console.log(book.info()); 
      // https://stackoverflow.com/questions/18333427/how-to-insert-a-row-in-an-html-table-body-in-javascript
      // Insert a row at end of table
      const newRow = lib_table.insertRow();
      
      for (i = 0; i < fields.length; i++) {
          // Insert cell at end of the row
          const newCell = newRow.insertCell();

          if (i === fields.length - 1){
            const button = document.createElement("button");
            button.classList.add("status-button")
            button.innerHTML = `${book[fields[i]]}`;
            newCell.appendChild(button);
            button.addEventListener("click", (e) => {
              toggleStatus(e);
            });
            continue;
          }

          // Append text node to cell
          const newText = document.createTextNode(`${book[fields[i]]}`);
          newCell.appendChild(newText);
      }

      // Add a delete button
      const newCell = newRow.insertCell();
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-button")
      deleteBtn.innerHTML = "DELETE";
      newCell.appendChild(deleteBtn);


      deleteBtn.addEventListener("click", (e) => {
        deleteBook(e);
      }); 
  // }
}

// function displayLibrary() {
//     // const fields = ['title', 'author', 'pages', 'status'];

//     for (let book of myLibrary) {
//         console.log(book.info()); 
//         // https://stackoverflow.com/questions/18333427/how-to-insert-a-row-in-an-html-table-body-in-javascript
//         // Insert a row at end of table
//         const newRow = lib_table.insertRow();
        
//         for (i = 0; i < fields.length; i++) {
//             // Insert cell at end of the row
//             const newCell = newRow.insertCell();

//             if (i === fields.length - 1){
//               const button = document.createElement("button");
//               button.classList.add("status-button")
//               button.innerHTML = `${book[fields[i]]}`;
//               newCell.appendChild(button);
//               continue;
//             }

//             // Append text node to cell
//             const newText = document.createTextNode(`${book[fields[i]]}`);
//             newCell.appendChild(newText);
//         }

//         // Add a delete button
//         const newCell = newRow.insertCell();
//         const button = document.createElement("button");
//         button.classList.add("delete-button")
//         button.innerHTML = "DELETE";
//         newCell.appendChild(button);
//     }
// }

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, 1);
addBookToLibrary(theHobbit);
addBookToLibrary(new Book("Alice in Wonderland", "Lewis Caroll", 500, 0));
addBookToLibrary(new Book("Naruto", "Masashi Kishimoto", 1000, 2));
// displayLibrary();

// const deleteBtns = document.querySelectorAll(".delete-button");
// const statusBtns = document.querySelectorAll(".status-button");

function clearForm() {
  author.value = "";
  title.value = "";
  pages.value = "";
  // indexDict[status.value] = "";
}

function clearDisplay() {
  lib_table.innerHTML = "";
}

function deleteBook(e) {
  // alert("Are you sure you want to delete this book?");
  e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
}
 
function toggleStatus(e) {
  let nextIndex = indexDict[e.target.innerHTML] + 1;

  if (nextIndex === 3) {
    nextIndex = 0;
  }

  let newStatus = statusOptions[nextIndex];
  e.target.innerHTML = newStatus;
}

function processForm() {
  console.log(author.value);
  console.log(title.value);
  console.log(pages.value);
  console.log(indexDict[status.value]);
  e.preventDefault();
  addBookToLibrary(new Book(author.value, title.value, pages.value, indexDict[status.value]));
  // displayLibrary;
}


// // Delete button clicked
// deleteBtns.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     deleteBook(e);
//   }); 
// });

// // Toggle status
// statusBtns.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     toggleStatus(e);
//   })
// });

form.addEventListener("submit", e => {
  // alert("submited");
  // console.log(e.target);
  console.log(author.value);
  console.log(title.value);
  console.log(pages.value);
  console.log(indexDict[status.value]);
  e.preventDefault();

  // clearDisplay();
  const newBook = new Book(title.value, author.value, pages.value, indexDict[status.value]);
  addBookToLibrary(newBook);
  console.log(newBook.info());
  // displayLibrary();
  clearForm();
});

// form.addEventListener("submit", processForm);