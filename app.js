const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = http.createServer(app);
const io = socket(server);

// DB setup
mongoose.connect('mongodb://localhost:chat-app/chat-app');

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/assets')));
router(app);

const port = process.env.PORT || 3000;

// TODO: move somewhere else
io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('send message', function(message) {
    io.emit('receive message', message);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


server.listen(port, function() {
  console.log('listening on *:' + port);
});