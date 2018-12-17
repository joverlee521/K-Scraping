// External dependencies
var Nightmare = require("nightmare");
var nightmare = Nightmare({show: false});
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");

// Import all models
var db = require("../models");

module.exports = function(app){
    // Scraper API 
    app.get("/scrape", function(req, res){
        axios.get("http://www.dramabeans.com/news/").then(function(response){
            var $ = cheerio.load(response.data);
            $(".thumb-content").each(function(){
                var result = {};
                result.headline = $(this).find(".post-title-thumbnail").children("a").text();
                result.summary = $(this).find(".post-content").text();
                result.link = $(this).children("a").attr("href");
                result.createdDate = $(this).find(".entry-date").text();
                result.imgRef = $(this).find("img").attr("src");
                db.Article.create(result).then(function(dbArticle){}).catch(function(err){
                    console.log(err);
                });
            });
            res.send("Scrape Complete");
        });
    });

    // Post Comment
    app.post("/comment", function(req, res){
        var comment = {
            comment: req.body.body,
            author: req.body.author
        };
        db.Comment.create(comment).then(function(dbComment){
            return db.Article.findOneAndUpdate({_id: req.body.articleId}, {$push: { comment: dbComment._id }}, {new: true})
        }).then(function(dbArticle){
            res.json(dbArticle);
        }).catch(function(err){
            console.log(err);
        });
    });
};