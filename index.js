// IMPORT //

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var User = require('./models/User');

http.listen(3000, function() {
	console.log('listening on *: 3000');
});

// CONNECTING TO THE DATABASE //

mongoose.connect('mongodb://localhost/rudichat');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection failed.'));

console.log("Connected to the database?")

// SET UP AUTHENTICATION SECRET //
app.set('secret', 'transparent');

// SET UP THE BODYPARSER
app.use(bodyParser.json());

// SETTING UP ROUTES //

app.get('/', function(req, res){
	res.sendFile(__dirname + "/static/index.html");
});
app.get('/login', function(req, res){
	res.sendFile(__dirname + "/static/login.html");
});

app.get('/chat', function(req, res) {
	
	res.sendFile(__dirname + "/static/chat.html");
});

app.post('/login', function(req, res){
	console.log("Received authentication data.")
	User.findOne({name: req.body.username},
		function(err, user) {
			if (err)
				res.json({success: false, message: "Malformed login/registration request."});
			else {
				if (!user) {
					// If the user is not in the database, register the user.
					var new_user = new User({name: req.body.username, password: req.body.password});
					new_user.save(function(err, new_user) {
						if (err) {
							console.log("Cannot add a new user.")
							res.json({success: false, message: "Cannot create a new user."});
							next();
						}
					});
					console.log("A new user is added!")
					res.json({success: true, message: "Registration complete.", token: jwt.sign(new_user, app.get('secret'))});
					
				} else {
					if (user.password != req.body.password) {
						res.json({success: false, message: "Wrong password"});
					} else {
						console.log("Authentication successful!");
						res.json({success: true, message: "Login successful.", token: jwt.sign(user, app.get('secret'))});
					}
				}
			}
		});
});

io.on('connection', function(socket) {
	console.log("A user connected.");

	socket.on('chat message', function(msg) {
		var msg_obj = JSON.parse(msg);
		jwt.verify(msg_obj.token, app.get('secret'), function() {
			var user = jwt.decode(msg_obj.token).name;
			io.emit('chat message', user + ": " + msg_obj.message);
		});
	});
});