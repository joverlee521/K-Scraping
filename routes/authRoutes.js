var passport = require("passport");
var db = require("../models");

module.exports = function(app){

    // Redirects to Google Sign in Page
    app.get("/auth/google", 
        passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));
    
    // Callback URL after sign-in 
    app.get("/auth/google/callback", 
        passport.authenticate("google", {failureRedirect: "/"}),
        function(req, res) {
            var profile = req.user.profile;
            // Finds or creates a new user with the user token id
            db.User.findOrCreate({oauthToken: profile.id}, function(err, user){
                req.session.token = user.oauthToken;
                if(user.username){
                    res.redirect("/");
                }
                else{
                    res.redirect("/newUser");
                }
            })
        }
    );
    
    // Logout URL
    app.get("/logout", function(req, res){
        req.logout();
        req.session = null;
        res.redirect("/");
    });
};
