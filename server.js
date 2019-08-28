var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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

app.get("/scrape", function(req, res) {
    axios.get("https://lordsofpain.net/").then(function(response) {

        var $ = cheerio.load(response.data);
    
        var results = {};
    
        $("h4").each(function(i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
    
            axios.get(link).then(function(response) {
                var $ = cheerio.load(response.data);
                var image = $("#main").find("img").attr("src");

                results.title = title;
                results.link = link;
                results.image = image;

                db.Article.create(results).then(function(dbArticle) {
                    console.log(dbArticle);
                }).catch(function(err) {
                    console.log(err);
                })
            })

        })
        res.send("Scrape complete");
    })
})

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });