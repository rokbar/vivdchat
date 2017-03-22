var express = require('express');
var path = require('path');
var http = require('http');
var socket = require('socket.io');
var app = express();

const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
  res.render('index', { title: 'Socket.io chat'});
});

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


server.listen(port, function() {
  console.log('listening on *:' + port);
});