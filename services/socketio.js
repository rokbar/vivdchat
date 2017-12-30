const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const config = require('../config/index');
const { saveMessage } = require('../controllers/groupChat');

module.exports = function (server) {
  const io = socket.listen(server);

  io.sockets
    .on('connection', socketioJwt.authorize({
      secret: config.secret,
      timeout: 15000
    }))
    .on('authenticated', (socket) => {
      const { name, sub } = socket.decoded_token;
      socket
        .on('send message', (message) => {
          saveMessage({ ...message, username: name, sub }, (payload) => {
            socket.broadcast.emit('receive message', payload);
          });
        })
        .on('disconnect', () => {
          console.log('user disconnected');
        });
    });
}