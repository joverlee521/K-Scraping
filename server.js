// Outer dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

// Sets up the express app
var app = express();
var PORT = prcoess.env.PORT || 8080;

// Sets up data handling for express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Make public a static folder
app.use(express.static("public"));

// Connect to MongoDB via mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function(){
    console.log("App running on port: " + PORT);
});