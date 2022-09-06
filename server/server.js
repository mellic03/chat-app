const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const cors = require('cors');
const cors_options = {
  origin: "*",
  methods: ["GET", "POST"]
}
app.use(cors(cors_options));
const http = require('http').Server(app);
const io = require('socket.io')(http, cors_options)

const sockets = require('./sockets');
const server = require('./listen');
const PORT = 3000;

sockets.connect(io, PORT);
server.listen(http, PORT);

// Routes
//-----------------------------
const group_routes = require('./API/group_routes');
const user_routes = require('./API/user_routes');

const group = new group_routes(app);
const user = new user_routes(app);

//-----------------------------



