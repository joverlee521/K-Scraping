// Importing models
var db = require("../models");

module.exports = function(app){
    // Load main page
    app.get("/", function(req, res){
        var loggedIn = false;
        if(req.session.token){
            loggedIn = true;
        }
        // Finds the more recent 5 articles in the database
        db.Article.find().sort({createdDate: -1}).limit(5).populate("comment").then(function(articles, err){
            if(err){
                return console.log(err);
            }
            if(loggedIn){
                db.User.findOne({oauthToken: req.session.token}).
                then(function(dbUser, err){
                    articles.forEach(function(element){
                        Object.assign(element, {bookmarked : false});
                        if(dbUser.bookmarks.indexOf(element._id)>= 0){
                            element.bookmarked = true;
                        }
                    });
                    return res.render("index", {
                        articles: articles,
                        loggedIn: loggedIn
                    })
                });
            }
            else{
                return res.render("index", {
                    articles: articles,
                    loggedIn: loggedIn
                });
            }
        });
    });

    // Load newUser page if user is signing in for the first time
    app.get("/newUser", function(req, res){
        if(req.session.token){
            res.render("newUser");
        }
        // Directs to error page if not signed in
        else{
            res.render("error", {
                title: "How did you get here?",
                message: "Please go back to the main page!",
                link: "/",
                linkName: "Main Page"
            });
        }
    });

    // Load user's bookmarks
    app.get("/bookmarks", function(req, res){
        if(req.session.token){
            db.User.findOne({oauthToken: req.session.token}).populate("bookmarks")
            .then(function(dbUser, err){
                if(err){
                    console.log(err);
                }
                res.render("index", {
                    bookmarks: true,
                    loggedIn: true,
                    dbUser,
                    articles: dbUser.bookmarks
                });
            });
        }
        // Directs to error page if not signed in
        else{
            res.render("error", {
                title: "Uh oh! You're not signed in!",
                message: "Please sign in to see your bookmarks!",
                link: "/auth/google",
                imgSrc: "/images/google-sign.png"
            });
        }
    });

    // General catch for invalid urls
    app.get("*", function(req, res){
        res.render("error", {
            title: "Where were you trying to go?",
            message: "Go back home!",
            link: "/",
            linkName: "Main Page"
        });
    });
};