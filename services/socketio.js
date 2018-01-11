const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const config = require('../config/index');
const { createSocket, saveMessage } = require('../controllers/groupChat');

module.exports = function (server) {
  const io = socket.listen(server);

  io.sockets
    .on('connection', socketioJwt.authorize({
      secret: config.secret,
      timeout: 15000
    }))
    .on('authenticated', joinRoom);
}

function joinRoom(socket) {
  const { name, sub } = socket.decoded_token;
  let group;

  socket
    .on('join room', (data) => {
      group = data;
      createSocket(group, sub, () => {
        socket.join(group);
      });
    })
    .on('send message', (message) => {
      // works on single node only, 
      // if there is more than one node running try socketio-redis library
      if (group && socket && socket.adapter.rooms[group].sockets[socket.id]) {
        saveMessage({ ...message, username: name, sub, group }, (payload) => {
          socket.broadcast.to(group).emit('receive message', payload);
        });
      }
    })
    .on('disconnect', () => leaveRoom(socket, group));
}

function leaveRoom(socket, group) {
  socket.leave(group);
  console.log('socket disconnected');
}
