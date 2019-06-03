/*
All necessary Javascript functionality is wrapped into this single Vue instance. Note that, in contrast to the pure JS version, all display/output functionality is processed using Vue v-for and {{}} notation directly in the HTML file.
*/

var app = new Vue({
    el: '#app',
    data: {
        books: [],
        search: ""
    },
    methods: {
        
/* 
getData() is a function to fetch data from the provided API, assign it a timestamp, and also assign the fetched data to local storage. Once both are complete, the function to Display Books is called.
*/
        getData() {

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

                app.books = data.books;

                localStorage.setItem("booksData", JSON.stringify(app.books));

                localStorage.setItem("bookTitleData", JSON.stringify(app.bookTitles));

                dataAge = Date.now();

                localStorage.setItem("Timestamp", dataAge);

            }).catch(function (error) {
                console.log("Request failed: " + error.message);
            });
        },
    },
    created() {
/*
This block of code will check if there's any data in local storage less than 10 minutes old. If so, that data will be used for the displayBooks function. Otherwise, a fresh fetch/display will be used for it.
*/        
        var timeStampNow = Date.now();

        if (localStorage.getItem("booksData") && timeStampNow - localStorage.getItem("Timestamp") < 600000) {
            this.books = JSON.parse(localStorage.getItem("booksData"));
//            this.bookTitles = JSON.parse(localStorage.getItem("bookTitleData"));
        } else {
            this.getData();
        }
    },
    computed: {
/*
This is our search functionality. The website only displays filtered books, and when the search box is empty there are zero filtered results so we see everything. Every time a character is typed into the box it checks that character against both title and description of all items in the API and displays only matched results.
*/
        filteredBooks: function () {
            return this.books.filter((book) => {

                return book.titulo.toUpperCase().match(this.search.toUpperCase()) || book.descripcion.toUpperCase().match(this.search.toUpperCase())
            })
        }
    }
});