// Including libraries

var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	path = require('path'),
	url = require('url'),
	fs = require('fs'),
	crypto = require('crypto'),
    io = require('socket.io').listen(server);

	
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};
    
        
server.listen(process.env.C9_PORT || 8333); 

app.get('/Game', function (req, res)
{
	res.sendfile(__dirname + '/assets/index.html' );    
	
});
app.use(express.static(path.join(__dirname, '/assets')));

app.get('/img', function (req, res)
{
	res.sendfile(__dirname + '/assets/img' );    
	
});
app.get('/', function (req, res)
{
	res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) 
{
	socket.emit("welcome", {});

	socket.on('username', function(username)
	{ 
		// store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
	});

	
	socket.on('adduser',function(roomCode,username)
	{
		roomsusers[roomCode] += ','+username;
		socket.emit('useradded',roomsusers[roomCode]);
	});
	
	socket.on('join', function(joincode,username)
	{
		
		socket.join(joincode);
		socket.emit('updatechat', username, 'you have connected to ' + joincode);
		socket.broadcast.to(joincode).emit('updatechat', username, username + ' has connected to this room');
		socket.emit('updaterooms', rooms, joincode);
		socket.emit("roomCodeIs", joincode);
	});	
});
