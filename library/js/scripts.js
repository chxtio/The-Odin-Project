"use strict";

// Signs-in your app
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of your app
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return (
    firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png"
  );
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Save new book info on the Cloud Firestore
function saveBook(book) {
  // Add new book entry to the Firebase database
  return firebase
    .firestore()
    .collection(getUserName())
    .add({
      title: book.title,
      author: book.author,
      pages: book.pages,
      status: book.status,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch(function (error) {
      console.error("Error writing data to Firebase Database", error);
    });
  console.log("Sucessfully saved information!");
}

function removeRow(e) {
  let title = e.target.parentNode.parentNode.firstChild.innerHTML;
  let deleted = true;
  var query = firebase
    .firestore()
    .collection(getUserName())
    .orderBy("timestamp", "asc");

  var docID;

  // Start listening to the query.
  query.get().then((snapshot) => {
    snapshot.docChanges().forEach(function (change) {
      var data = change.doc.data();
      if (data.title === title && deleted) {
        docID = change.doc.id;
        console.log("Deleting: ", docID);
        firebase
          .firestore()
          .collection(getUserName())
          .doc(docID)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
            // Clear from the UI
            e.target.parentNode.parentNode.parentNode.removeChild(
              e.target.parentNode.parentNode
            );
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      }
    });
  });
}

function updateStatus(e, newStatus) {
  let rowTitle = e.target.parentNode.parentNode.firstChild.innerHTML;

  var query = firebase
    .firestore()
    .collection(getUserName())
    .orderBy("timestamp", "asc");

  var docID;
  // Start listening to the query.
  query.get().then((snapshot) => {
    snapshot.docChanges().forEach(function (change) {
      console.log("docID: " + change.doc.id + " Update status: " + change.type);
      var data = change.doc.data();
      if (data.title === rowTitle) {
        docID = change.doc.id;
        firebase
          .firestore()
          .collection(getUserName())
          .doc(docID)
          .update("status", newStatus)
          .then(() => {
            console.log("Status successfully updated to :", newStatus);
            // Update status in UI
            e.target.innerHTML = newStatus;
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
    });
  });
}

// Loads book entries and listens for upcoming ones.
function loadLibrary(usern) {
  // alert(usern + " is signed in")

  // Create the query to load the books
  var query = firebase
    .firestore()
    .collection(usern)
    .orderBy("timestamp", "asc"); //.limit(12);

  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      console.log("LoadLib- Change type of " + change.type);
      if (change.type === "added") {
        var data = change.doc.data();
        // console.log("status test: ", data.status);
        const newBook = new Book(
          data.title,
          data.author,
          data.pages,
          indexDict[data.status]
        );
        addBookToLibrary(newBook);
      } else if (change.type === "removed") {
        // console.log("test- removed");
        // deleteBook(change.doc.id);
        // console.log("LoadLib- Removed triggered");
      } else if (change.type === "modified") {
        // alert("LoadLib- change type of modified");
        // console.log("LoadLib- change type of modified");
      }
    });
  });
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage =
      "url(" + addSizeToGoogleProfilePic(profilePicUrl) + ")";
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute("hidden");
    userPicElement.removeAttribute("hidden");
    signOutButtonElement.removeAttribute("hidden");

    // Hide sign-in button.
    signInButtonElement.setAttribute("hidden", "true");

    // alert("signed in!");
    clearDisplay();
    loadLibrary(userName);

    //  // We save the Firebase Messaging Device token and enable notifications.
    //  saveMessagingDeviceToken();
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");

    // Show sign-in button.
    signInButtonElement.removeAttribute("hidden");

    // Load sample library
    clearDisplay();
    loadSampleLibrary();
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: "You must sign-in first",
    timeout: 2000
  };
  // signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (
    !window.firebase ||
    !(firebase.app instanceof Function) ||
    !firebase.app().options
  ) {
    window.alert(
      "You have not configured and imported the Firebase SDK. " +
        "Make sure you go through the codelab setup instructions and make " +
        "sure you are running the codelab using `firebase serve`"
    );
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var userPicElement = document.getElementById("user-pic");
var userNameElement = document.getElementById("user-name");
var signInButtonElement = document.getElementById("sign-in");
var signOutButtonElement = document.getElementById("sign-out");

// Saves message on form submit.
//  messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener("click", signOut);
signInButtonElement.addEventListener("click", signIn);

// initialize Firebase
initFirebaseAuth();

//---------------FIREBASE END--------------------------///

const container = document.querySelector("#container");
const lib_table = document.querySelector("#book_entries");
const fields = ["title", "author", "pages", "status"];
const statusOptions = ["Read", "Not Read", "In Progress"];
const indexDict = { Read: 0, "Not Read": 1, "In Progress": 2 };
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
  this.info = function () {
    return `${title} by ${author}, ${pages}, ${status}`;
  };
}

function addBookToLibrary(newBook) {
  if (myLibrary.includes(newBook)) {
    return;
  }
  myLibrary.push(newBook);
  displayLibrary(newBook);
  deleteBtns = document.querySelectorAll(".delete-button");
  statusBtns = document.querySelectorAll(".status-button");
}

// Display new book
function displayLibrary(book) {
  console.log(book.info());
  // https://stackoverflow.com/questions/18333427/how-to-insert-a-row-in-an-html-table-body-in-javascript
  // Insert a row at end of table
  const newRow = lib_table.insertRow();

  for (let i = 0; i < fields.length; i++) {
    // Insert cell at end of the row
    const newCell = newRow.insertCell();

    if (i === fields.length - 1) {
      const button = document.createElement("button");
      button.classList.add("status-button");
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
  deleteBtn.classList.add("delete-button");
  deleteBtn.innerHTML = "DELETE";
  newCell.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    deleteBook(e);
  });
}

function loadSampleLibrary() {
  const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, 0);
  addBookToLibrary(theHobbit);
  addBookToLibrary(new Book("Alice in Wonderland", "Lewis Caroll", 500, 0));
  addBookToLibrary(
    new Book("A Game Of Thrones", "George R. R. Martin", 694, 1)
  );
}

function clearForm() {
  author.value = "";
  title.value = "";
  pages.value = "";
}

function clearDisplay() {
  lib_table.innerHTML = "";
}

function deleteBook(e) {
  if (!confirm("Are you sure you want to delete this book?")) {
    return;
  }

  alert("delete triggered");

  let user = firebase.auth().currentUser;
  // If signed in
  if (user) {
    // remove data from Firestore
    removeRow(e);
    return;
  }

  // Clear from the UI
  e.target.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode
  );
}

function toggleStatus(e) {
  let nextIndex = indexDict[e.target.innerHTML] + 1;
  if (nextIndex === 3) {
    nextIndex = 0;
  }
  let newStatus = statusOptions[nextIndex];

  let user = firebase.auth().currentUser;
  // If signed in
  if (user) {
    // Update data in Firestore
    updateStatus(e, newStatus);
    return;
  }

  // Update status in UI
  e.target.innerHTML = newStatus;
}

form.addEventListener("submit", (e) => {
  console.log(author.value);
  console.log(title.value);
  console.log(pages.value);
  console.log(indexDict[status.value]);
  e.preventDefault();

  // clearDisplay();
  const newBook = new Book(
    title.value,
    author.value,
    pages.value,
    indexDict[status.value]
  );

  let user = firebase.auth().currentUser;
  if (user) {
    // If signed in
    saveBook(newBook);
  } else {
    addBookToLibrary(newBook);
  }

  // console.log(newBook.info());
  clearForm();
});
