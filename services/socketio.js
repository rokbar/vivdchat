const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const config = require('../config/index');

module.exports = function(server) {
  const io = socket.listen(server);

  // Socket authorization middleware
  io.use(socketioJwt.authorize({
    secret: config.secret,
    handshake: true
  }));

  io.sockets
    .on('connection', function(socket) {
      // send message event listener
      socket.on('send message', function(message) {
        socket.broadcast.emit('receive message', message);
      });

      socket.on('disconnect', function() {
        console.log('user disconnected');
      });
    });
}