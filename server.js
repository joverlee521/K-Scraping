// Outer dependencies
require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");

// Sets up the express app
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up data handling for express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Passport
var auth = require("./config/auth");
auth(passport);
app.use(passport.initialize());

// Cookies
app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEY]
}));
app.use(cookieParser());

// Make public a static folder
app.use(express.static("public"));

// Connect to MongoDB via mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
require("./routes/apiRoutes")(app);
require("./routes/authRoutes")(app);
require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function(){
    console.log("App running on port: " + PORT);
});