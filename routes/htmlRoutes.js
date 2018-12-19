// Importing models
var db = require("../models");

module.exports = function(app){
    // Load main page
    app.get("/", function(req, res){
        // Finds the more recent 5 articles in the database
        db.Article.find().sort({createdDate: -1}).limit(5).populate("comment").then(function(articles, err){
            if(err){
                return console.log(err);
            }
            res.render("index", {
                articles: articles
            });
        });
    });

    app.get("/bookmarks", function(req, res){
            // res.render("index", {
            //     bookmarks: true
            // });
            res.render("error", {
                title: "Uh oh! You're not signed in!",
                message: "Please sign in to see your bookmarks!"
            });
        
    });
};