'use strict';

const PORT = 3000
const password = process.env.PASSWORD
const apiKey = process.env.APIKEY
const url = `postgres://wajeeh:${password}@localhost:5432/wajeeh`
const axios = require('axios').default;
const express = require('express');
const bodyParser = require('body-parser')
require("dotenv").config();

const { Client } = require('pg')
const client = new Client(url)

const recipesData = require("./data.json");
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// creating a route
app.post("/addMovie", handleAdd)
app.get("/getMovies", handleGet)
app.get("/", handleHomePage)
app.get("/favorite", handleFavPage)
app.get("/status500", handleError500)
app.get("/trending", handleTrending)
app.get("/search", handleSearch)
app.get("/topRated", handleTop)
app.get("/upComing", handleUpComing)
app.get("*", handleError404)


// functions: 
function handleAdd(req, res) {
    const { title, summary } = req.body;
    let sql = `INSERT INTO movie(title,summary) VALUES($1,$2) RETURNING *;`
    let values = [title, summary]
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows);
    }).catch()
}

function handleGet(req, res) {
    let sql = `SELECT * from movie`
    client.query(sql).then((result) => {
        res.json(result.rows)
    }).catch()
}

function handleHomePage(req, res) {
    res.send({
        "title": "Spider-Man: No Way Home",
        "poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        "overview": "Peter Parker is unmasked and no longer able to separate his normal life."
    });
}

function handleFavPage(req, res) {
    res.send(`Welcome to my Favorite Page`)
}

function handleError500(req, res) {
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    })
}

function handleTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)

        .then(result => {
            let recipes = result.data.results.map(trend => {
                return new Trending(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            })
            res.json(recipes)
        })
        .catch(error => {
            console.log(error);
        })
}

function handleTop(req, res) {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)

        .then(result => {
            let recipes = result.data.results.map(trend => {
                return new Trending(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            })
            res.json(recipes)
        })
        .catch(error => {
            console.log(error);
        })
}

function handleUpComing(req, res) {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)

        .then(result => {
            let recipes = result.data.results.map(trend => {
                return new Trending(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            })
            res.json(recipes)
        })
        .catch(error => {
            console.log(error);
        })
}



function handleSearch(req, res) {
    let movieName = req.query.movieName
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
    axios
        .get(url)
        .then(result => {
            let recipes = result.data.results.map(trend => {
                return new Trending(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            })
            res.json(recipes)
        })
        .catch(error => {
            console.log(error);
            res.send("Not Found")
        })
}


function handleError404(req, res) {
    res.status(404).send({
        "status": 404,
        "responseText": "page not found error"
    })
}

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Example app listening on PORT ${PORT}`)
    })
})



function Trending(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}