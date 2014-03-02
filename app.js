// import core modules and local module
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// set variables
app.set('port', process.env.VCAP_APP_PORT || 3000);
// let express know where is the views diectory
// _dirname is current directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// use middlewares
// middleware is one step in the pipe line of processing request
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
// for public folder, match the request to files directly
// same as the legacy web server do
app.use(express.static(path.join(__dirname, 'public')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.post('/vote', routes.vote);

io.sockets.on('connection', routes.vote);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
