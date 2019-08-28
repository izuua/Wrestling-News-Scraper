var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lopdb";

mongoose.connect(MONGODB_URI);

axios.get("https://lordsofpain.net/").then(function(response) {

    var $ = cheerio.load(response.data);

    var results = [];

    $("h4").each(function(i, element) {
        var title = $(element).children().text();
        var link = $(element).find("a").attr("href");

        results.push({
            title: title,
            link: link
        })
    })

    console.log(results);
})


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });