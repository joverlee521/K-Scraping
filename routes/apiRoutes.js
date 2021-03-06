// External dependencies
var cheerio = require("cheerio");
var axios = require("axios");
var async = require("async");

// Import all models
var db = require("../models");

module.exports = function(app){

    // Scrapes new articles from the web
    app.get("/scrape", function(req, res){
        axios.get("http://www.dramabeans.com/news/").then(function(response){
            var $ = cheerio.load(response.data);
            var functionsObjs = {};
            $(".thumb-content").each(function(i){
                var result = {};
                result.headline = $(this).find(".post-title-thumbnail").children("a").text();
                result.summary = $(this).find(".post-content").text();
                result.link = $(this).children("a").attr("href");
                result.createdDate = $(this).find(".entry-date").text();
                result.imgRef = $(this).find("img").attr("src");
                // Stores database function as a method in an object
                functionsObjs[i] = function(cb){
                    db.Article.create(result, function(err, dbArticle){
                        if(err){
                            return cb(null, "Error: " + err.errmsg);
                        }
                        cb(null, dbArticle);
                    });
                }
            });
            // Runs all async methods in the functions object and returns results(error or article)
            async.series(functionsObjs, function(err, results){
                res.send(results);
            });
        });
    });

    // Post Comment
    app.post("/comment", function(req, res){
        var comment = {
            comment: req.body.body,
            author: req.body.author,
            authorId: req.session.token
        };
        // Creates comment in the database and updates correponding article
        db.Comment.create(comment).then(function(dbComment){
            return db.Article.findOneAndUpdate({_id: req.body.articleId}, {$push: { comment: dbComment._id }}, {new: true}).populate("comment")
        }).then(function(dbArticle){
            var index = (dbArticle.comment.length) - 1;
            var newComment = dbArticle.comment[index];
            // Returns created comment to the front-end
            if(req.session.token){
                res.json([newComment, {oauthToken : req.session.token}]);
            }
            else{
                res.json([newComment]);
            }
        }).catch(function(err){
            console.log(err);
        });
    });

    app.delete("/comment/:commentId/:articleId", function(req, res){
        var commentId = req.params.commentId;
        var articleId = req.params.articleId;
        db.Comment.deleteOne({ _id : commentId }).then(function(data, err){
            if(err){
                return console.log(err);
            }
            db.Article.updateOne({ _id: articleId}, {$pull: {comment: commentId}}).then(function(data, err){
                if(err){
                    return console.log(err);
                }
                res.sendStatus(200);
            });
        });
    });

    // Load more articles from database
    app.get("/loadMore/:skip", function(req, res){
        // Skips the number of articles already displayed to prevent duplicates
        var skipNum = parseInt(req.params.skip);
        db.Article.find().sort({createdDate: -1}).skip(skipNum).limit(5).populate("comment").then(function(articles, err){
            if(err){
                return console.log(err);
            }
            if(req.session.token && articles.length > 0){
                db.User.findOne({oauthToken: req.session.token})
                .then(function(dbUser, err){
                    articles.forEach(function(element){
                        Object.assign(element._doc, {bookmarked : false});
                        if(dbUser.bookmarks.indexOf(element._id) >= 0){
                            element._doc.bookmarked = true;
                        }
                        console.log(element);
                    });
                    return res.send([articles, dbUser]);
                })
            }
            else{
                res.send([articles]);
            }
        });
    });

    // Update username
    app.put("/username", function(req, res){
        db.User.findOneAndUpdate({oauthToken: req.session.token}, {$set: {username: req.body.username}}, {new: true})
        .then(function(dbUser){
            res.json(dbUser)
        }).catch(function(err){
            res.json(err);
        })
    });

    // Update User's bookmarks
    app.put("/bookmark/:articleId", function(req, res){
        var id = req.params.articleId;
        var user = req.session.token;
        db.User.findOne({oauthToken: user})
        .then(function(dbUser){
            if(dbUser.bookmarks.indexOf(id) >= 0){
                return res.sendStatus(403);
            }
            db.User.update({oauthToken: user}, {$push: {bookmarks: id}})
            .then(function(){
                return res.sendStatus(200);
            });
        }).catch(function(err){
            res.json(err);
        })
    });

    app.delete("/bookmark/:articleId", function(req, res){
        var id = req.params.articleId;
        var user = req.session.token;
        db.User.findOneAndUpdate({oauthToken: user}, {$pull: {bookmarks: id}})
        .then(function(){
            return res.sendStatus(200);
        }).catch(function(err){
            res.json(err);
        });
    });
};