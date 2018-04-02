// =============================================================|
// Server.js - This file is the initial starting point for the Node/Express server.
// =============================================================|
var express = require("express");
var compression = require("compression");

// Sets up the Express App
// =============================================================|
var app = express();
var PORT = process.env.PORT || 8080;

// Dependencies
// =============================================================|
var bodyParser = require("body-parser");
var setupPassport = require('./passport.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require("connect-flash");
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(compression());

// Determine our connection
// =============================================================|
if (PORT === 8080) {
	var keys = require("./app/config/keys.js");
} else {
	console.log("Heroku connection");
	var keys = process.env
};

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
	  apiKey: keys.apiKey,
  	  apiSecret: keys.apiSecret
});


// Setting up login session
// =============================================================|
app.use(cookieParser())
app.use(session({ secret: 'friedbanana', resave: false, saveUninitialized: false }))
app.use(flash());

setupPassport(app);

app.use('/static', express.static(process.cwd() + "/public"));

// Routes
// =============================================================|
require("./routes/routes.js")(app);


// Any non API GET routes will be directed to our React App and handled by React Router
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log(`Server running http://localhost:${PORT}, Ctrl + c to stop`);
    });
});
console.log('NODE_ENV: '+ process.env.NODE_ENV);