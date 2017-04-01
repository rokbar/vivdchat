const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const router = require('./router');
const socketioService = require('./services/socketio');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = http.createServer(app);

// DB setup
mongoose.connect('mongodb://localhost:chat-app/chat-app');

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(express.static(path.join(__dirname, 'public/assets')));
router(app);
socketioService(server);

const port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('listening on *:' + port);
});