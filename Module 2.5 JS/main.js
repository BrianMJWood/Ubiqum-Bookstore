var books = []

/* 
getData() is a function to fetch data from the provided API, assign it a timestamp, and also assign the fetched data to local storage. Once both are complete, the function to Display Books is called.
*/
function getData() {

    var data;

    fetch("https://api.myjson.com/bins/1h3vb3", {

        method: "GET",

    }).then(function (response) {

        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(function (json) {
        data = json;

        books = data.books;

        localStorage.setItem("booksData", JSON.stringify(books));

        dataAge = Date.now();
        localStorage.setItem("Timestamp", dataAge);

        displayBooks(books);

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });
}
/*
This block of code will check if there's any data in local storage less than 10 minutes old. If so, that data will be used for the displayBooks function. Otherwise, a fresh fetch/display will be used for it.
*/
var timeStampNow = Date.now();

if (localStorage.getItem("booksData") && timeStampNow - localStorage.getItem("Timestamp") < 600000) {
    books = JSON.parse(localStorage.getItem("booksData"));
    displayBooks(books);
} else {
    getData();
}
/*
This is our primary display function. It takes data passed to it either from a fresh fetch or from local storage and dynamically creates and displays large thumbnails for each object from the API. Each thumbnail has the requested flipcard functionality, including a button to display a larger image in a FancyBox gallery.
*/
function displayBooks(array) {

    var mainDisplay = document.getElementById("mainDisplay");
    mainDisplay.innerHTML = ""
    for (var i = 0; i < array.length; i++) {

        var imageLink = array[i].portada;
        var titleData = array[i].titulo;
        var descriptionData = array[i].descripcion;
        var frontButton = document.createElement("button");
        frontButton.append("See More");
        var largeImage = array[i].detalle;

        frontButton.setAttribute("data-fancybox", "gallery")
        frontButton.setAttribute("href", largeImage)
        frontButton.className = "cardButton";

        var image = document.createElement("IMG");
        image.setAttribute("src", imageLink);
        image.className = "previewImage";
        var title = document.createElement("h2");
        title.append(titleData);
        var description = document.createElement("p");
        description.append(descriptionData);


        var flipcard = document.createElement("div");
        flipcard.className = "previewBox flip-card";
        mainDisplay.appendChild(flipcard);


        var flipcardInner = document.createElement("div");
        flipcardInner.className = "flip-card-inner ";
        flipcard.appendChild(flipcardInner);

        var flipcardFront = document.createElement("div");
        flipcardFront.className = "flip-card-front";
        flipcardInner.appendChild(flipcardFront);

        flipcardFront.appendChild(image);


        var flipcardBack = document.createElement("div");
        flipcardBack.className = "flip-card-back";
        flipcardInner.appendChild(flipcardBack);

        flipcardBack.appendChild(title);
        flipcardBack.appendChild(description);
        flipcardBack.appendChild(frontButton);
    }
}

/*
This is our search functionality. Every time a character is entered into the search box, we loop through the titles and description provided by the API and check if that content matches what was typed by the user. Any content that matches is pushed to a new filtered Array which is then pushed to the primary Display Books function. Using this method instead of a show/hide CSS edit ensures that the FancyBox gallery does not always contain all images.
*/

var filterInput = document.getElementById("search");
filterInput.addEventListener('keyup', filterBooks);

function filterBooks() {

    var box = document.getElementsByClassName("previewBox");
    var filteredBooks = []

    var filterValue = document.getElementById("search").value.toUpperCase();
    for (var i = 0; i < books.length; i++) {
        if ((books[i].titulo.toUpperCase().indexOf(filterValue) > -1) || (books[i].descripcion.toUpperCase().indexOf(filterValue) > -1)) {
            filteredBooks.push(books[i]); displayBooks(filteredBooks);
        }
    }
}