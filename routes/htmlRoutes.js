module.exports = function(app){
    // Load main page
    app.get("/", function(req, res){
        res.render("index");
    });

    app.get("/bookmarks", function(req, res){
        res.render("index", {
            bookmarks: true
        });
    });
};