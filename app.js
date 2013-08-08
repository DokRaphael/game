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
	socket.on("device", function(device)
   {
      // if client is a browser game
    	if(device.type == "controller")
    	{
    	    socket.emit("connected");
		}
    	if(device.type == "game")
		{
			socket.emit("initialize");
		}	
	});                                                                                                                                                                                                                                                                                                                                                                                                               ;


	socket.on("turn", function(data)
   {
   		socket.emit("turn", data.turn);
   });	
});