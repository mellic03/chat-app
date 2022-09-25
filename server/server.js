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

const server = require('./listen');
const PORT = 3000;

server.listen(http, PORT);

// Routes

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017/mydb";
MongoClient.connect(uri, {}, (err, client) => {
  if (err) {return console.log(err)};
  
  const db = client.db("chatapp");

  require("./API/routes")(app, db);
  const sockets = require('./sockets')(db);
  sockets.connect(io, PORT);
  // db.collection("test").find().toArray
});