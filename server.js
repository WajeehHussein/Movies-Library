'use strict';

// 1. require the package
const express = require('express');
const recipesData = require("./data.json");

// 2. create an Express app
const app = express();
const port = 3000

// 4. creating a route

app.get("/", handleHomePage)
app.get("/favorite", handleFavPage)
app.get("/status500", handleError500)
app.get("*", handleError404)



// functions: 
function handleHomePage(req, res) {
    res.send({
        "title": "Spider-Man: No Way Home",
        "poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
    });
}

function handleFavPage(req, res) {
    res.send(`Welcome to Favorite Page`)
}
function handleError500(req, res) {
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    })
}
function handleError404(req, res) {
    res.status(404).send({
        "status": 404,
        "responseText": "page not found error"
    })
}


app.listen(port, handleListen)
function handleListen() {
    console.log(`Example app listening on port ${port}`)
}