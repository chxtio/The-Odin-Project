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
  // var user = firebase.auth().currentUser.uid;
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
  var query = firebase
    .firestore()
    .collection(getUserName())
    .orderBy("timestamp", "asc");

  var docID;
  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      var data = change.doc.data();
      if (data.title === title) {
        docID = change.doc.id;
        console.log("Deleteing: ", docID);
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
	// let newStatus = statusOptions[nextIndex];
  let rowTitle = e.target.parentNode.parentNode.firstChild.innerHTML;
  var query = firebase
    .firestore()
    .collection(getUserName())
    .orderBy("timestamp", "asc");

  var docID;
  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      var data = change.doc.data();
      if (data.title === rowTitle) {
        docID = change.doc.id;
        firebase
          .firestore()
          .collection(getUserName())
          .doc(docID)
					.update('status', newStatus)
          // .set({
          //   title: data.title,
          //   author: data.author,
          //   pages: data.pages,
          //   status: newStatus,
          //   timestamp: data.timestamp
          // })
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
function loadLibrary() {
  // var user = firebase.auth().currentUser;
  // if (user) {
  //   alert(user);
  // } else {
  //   // alert("nullnullnull");
  // }
  // alert(getUserName());
  // Create the query to load the books
  var query = firebase
    .firestore()
    .collection("Chris Tio")
    .orderBy("timestamp", "asc"); //.limit(12);

  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      // console.log(change.type);
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
        console.log("LoadLib- Removed triggered");
      } else if (change.type === "modified") {
				// alert("LoadLib- change type of modified");
        console.log("LoadLib- change type of modified");
			}
    });
  });
}

//  // Saves a new message containing an image in Firebase.
//  // This first saves the image in Firebase storage.
//  function saveImageMessage(file) {
//    // 1 - We add a message with a loading icon that will get updated with the shared image.
//    firebase.firestore().collection('messages').add({
//      name: getUserName(),
//      imageUrl: LOADING_IMAGE_URL,
//      profilePicUrl: getProfilePicUrl(),
//      timestamp: firebase.firestore.FieldValue.serverTimestamp()
//    }).then(function(messageRef) {
//      // 2 - Upload the image to Cloud Storage.
//      var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
//      return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
//        // 3 - Generate a public URL for the file.
//        return fileSnapshot.ref.getDownloadURL().then((url) => {
//          // 4 - Update the chat message placeholder with the image’s URL.
//          return messageRef.update({
//            imageUrl: url,
//            storageUri: fileSnapshot.metadata.fullPath
//          });
//        });
//      });
//    }).catch(function(error) {
//      console.error('There was an error uploading a file to Cloud Storage:', error);
//    });
//  }

//  // Saves the messaging device token to the datastore.
//  function saveMessagingDeviceToken() {
//    firebase.messaging().getToken().then(function(currentToken) {
//      if (currentToken) {
//        console.log('Got FCM device token:', currentToken);
//        // Saving the Device Token to the datastore.
//        firebase.firestore().collection('fcmTokens').doc(currentToken)
//            .set({uid: firebase.auth().currentUser.uid});
//      } else {
//        // Need to request permissions to show notifications.
//        requestNotificationsPermissions();
//      }
//    }).catch(function(error){
//      console.error('Unable to get messaging token.', error);
//    });
//  }

//  // Requests permissions to show notifications.
//  function requestNotificationsPermissions() {
//    console.log('Requesting notifications permission...');
//    firebase.messaging().requestPermission().then(function() {
//      // Notification permission granted.
//      saveMessagingDeviceToken();
//    }).catch(function(error) {
//      console.error('Unable to get permission to notify.', error);
//    });
//  }

//  // Triggered when a file is selected via the media picker.
//  function onMediaFileSelected(event) {
//    event.preventDefault();
//    var file = event.target.files[0];

//    // Clear the selection in the file picker input.
//    imageFormElement.reset();

//    // Check if the file is an image.
//    if (!file.type.match('image.*')) {
//      var data = {
//        message: 'You can only share images',
//        timeout: 2000
//      };
//      signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
//      return;
//    }
//    // Check if the user is signed-in
//    if (checkSignedInWithMessage()) {
//      saveImageMessage(file);
//    }
//  }

//  // Triggered when the send new message form is submitted.
//  function onMessageFormSubmit(e) {
//    e.preventDefault();
//    // Check that the user entered a message and is signed in.
//    if (messageInputElement.value && checkSignedInWithMessage()) {
//      saveMessage(messageInputElement.value).then(function() {
//        // Clear message text field and re-enable the SEND button.
//        resetMaterialTextfield(messageInputElement);
//        toggleButton();
//      });
//    }
//  }

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
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

//  // Resets the given MaterialTextField.
//  function resetMaterialTextfield(element) {
//    element.value = '';
//    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
//  }

//  // Template for messages.
//  var MESSAGE_TEMPLATE =
//      '<div class="message-container">' +
//        '<div class="spacing"><div class="pic"></div></div>' +
//        '<div class="message"></div>' +
//        '<div class="name"></div>' +
//      '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

//  // Delete a Message from the UI.
//  function deleteMessage(id) {
//    var div = document.getElementById(id);
//    // If an element for that message exists we delete it.
//    if (div) {
//      div.parentNode.removeChild(div);
//    }
//  }

//  function createAndInsertMessage(id, timestamp) {
//    const container = document.createElement('div');
//    container.innerHTML = MESSAGE_TEMPLATE;
//    const div = container.firstChild;
//    div.setAttribute('id', id);

//    // If timestamp is null, assume we've gotten a brand new message.
//    // https://stackoverflow.com/a/47781432/4816918
//    timestamp = timestamp ? timestamp.toMillis() : Date.now();
//    div.setAttribute('timestamp', timestamp);

//    // figure out where to insert new message
//    const existingMessages = messageListElement.children;
//    if (existingMessages.length === 0) {
//      messageListElement.appendChild(div);
//    } else {
//      let messageListNode = existingMessages[0];

//      while (messageListNode) {
//        const messageListNodeTime = messageListNode.getAttribute('timestamp');

//        if (!messageListNodeTime) {
//          throw new Error(
//            `Child ${messageListNode.id} has no 'timestamp' attribute`
//          );
//        }

//        if (messageListNodeTime > timestamp) {
//          break;
//        }

//        messageListNode = messageListNode.nextSibling;
//      }

//      messageListElement.insertBefore(div, messageListNode);
//    }

//    return div;
//  }

//  // Displays a Message in the UI.
//  function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
//    var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

// profile picture
//  if (picUrl) {
//    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
//  }

//    div.querySelector('.name').textContent = name;
//    var messageElement = div.querySelector('.message');

//    if (text) { // If the message is text.
//      messageElement.textContent = text;
//      // Replace all line breaks by <br>.
//      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
//    } else if (imageUrl) { // If the message is an image.
//      var image = document.createElement('img');
//      image.addEventListener('load', function() {
//        messageListElement.scrollTop = messageListElement.scrollHeight;
//      });
//      image.src = imageUrl + '&' + new Date().getTime();
//      messageElement.innerHTML = '';
//      messageElement.appendChild(image);
//    }
//    // Show the card fading-in and scroll to view the new message.
//    setTimeout(function() {div.classList.add('visible')}, 1);
//    messageListElement.scrollTop = messageListElement.scrollHeight;
//    messageInputElement.focus();
//  }

//  // Enables or disables the submit button depending on the values of the input
//  // fields.
//  function toggleButton() {
//    if (messageInputElement.value) {
//      submitButtonElement.removeAttribute('disabled');
//    } else {
//      submitButtonElement.setAttribute('disabled', 'true');
//    }
//  }

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
//  var messageListElement = document.getElementById('messages');
//  var messageFormElement = document.getElementById('message-form');
//  var messageInputElement = document.getElementById('message');
//  var submitButtonElement = document.getElementById('submit');
//  var imageButtonElement = document.getElementById('submitImage');
//  var imageFormElement = document.getElementById('image-form');
//  var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById("user-pic");
var userNameElement = document.getElementById("user-name");
var signInButtonElement = document.getElementById("sign-in");
var signOutButtonElement = document.getElementById("sign-out");
//  var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// Saves message on form submit.
//  messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener("click", signOut);
signInButtonElement.addEventListener("click", signIn);

// Toggle for the button.
//  messageInputElement.addEventListener('keyup', toggleButton);
//  messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
//  imageButtonElement.addEventListener('click', function(e) {
//    e.preventDefault();
//    mediaCaptureElement.click();
//  });
//  mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase
initFirebaseAuth();

//   // TODO: Enable Firebase Performance Monitoring.
//  firebase.performance();

//  // We load currently existing chat messages and listen to new ones.
loadLibrary();

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

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, 0);
addBookToLibrary(theHobbit);
addBookToLibrary(new Book("Alice in Wonderland", "Lewis Caroll", 500, 0));
addBookToLibrary(new Book("A Game Of Thrones", "George R. R. Martin", 694, 1));

function clearForm() {
  author.value = "";
  title.value = "";
  pages.value = "";
}

function clearDisplay() {
  lib_table.innerHTML = "";
}

function deleteBook(e) {
  // if (!confirm("Are you sure you want to delete this book?")) {
  // return;
  // }
	
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
  if (nextIndex === 2) {
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
  if (user) { 	// If signed in
		saveBook(newBook);
  } else {
    addBookToLibrary(newBook);
  }
 
  // console.log(newBook.info());
  clearForm();
});
