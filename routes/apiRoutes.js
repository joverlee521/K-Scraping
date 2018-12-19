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
            var resultObjs = [];
            $(".thumb-content").each(function(){
                var result = {};
                result.headline = $(this).find(".post-title-thumbnail").children("a").text();
                result.summary = $(this).find(".post-content").text();
                result.link = $(this).children("a").attr("href");
                result.createdDate = $(this).find(".entry-date").text();
                result.imgRef = $(this).find("img").attr("src");
                resultObjs.push(result);
            });
            db.Article.insertMany(resultObjs).then(function(articles){
                console.log("ARTICLES " + articles);
                res.end();
            }).catch(function(err){
                console.log("ERROR " + err);
                res.end();
            });
        });
    });

    // Post Comment
    app.post("/comment", function(req, res){
        var comment = {
            comment: req.body.body,
            author: req.body.author
        };
        db.Comment.create(comment).then(function(dbComment){
            return db.Article.findOneAndUpdate({_id: req.body.articleId}, {$push: { comment: dbComment._id }}, {new: true}).populate("comment")
        }).then(function(dbArticle){
            var index = (dbArticle.comment.length) - 1;
            var newComment = dbArticle.comment[index];
            res.json(newComment);
        }).catch(function(err){
            console.log(err);
        });
    });

    // Load more articles
    app.get("/loadMore/:skip", function(req, res){
        var skipNum = parseInt(req.params.skip);
        db.Article.find().sort({createdDate: -1}).skip(skipNum).limit(5).populate("comment").then(function(articles, err){
            if(err){
                return console.log(err);
            }
            res.send(articles);
        });
    });
};