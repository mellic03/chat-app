const fs = require("fs");
const express = require('express');
const app = express();
const http = require("http");

const cors = require('cors');
const cors_options = {
  origin: true,
  methods: "POST, GET, PUT, OPTIONS, DELETE"
}

app.use(express.json({limit: "25mb"}));
// app.use(express.urlencoded({limit: "25mb"}));
app.use(cors(cors_options));

const PORT = 3000;

// const options = {
//   key: fs.readFileSync("./key.pem"),
//   cert: fs.readFileSync("./cert.pem")
// };
// const httpServer = http.createServer(options, app);
const httpServer = http.createServer(app);


httpServer.listen(PORT, () => {
  console.log("Server running on " + PORT);
});

const io = require('socket.io')(httpServer, cors_options)


const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
MongoClient.connect(uri, {}, (err, client) => {
  if (err)  return console.log(err)
  console.log("Connected to mongodb successfully");

  const db = client.db("chatapp");
  require("./API/routes")(app, db);
  const sockets = require('./sockets')(db, app);
  sockets.connect(io, PORT, app);

  // In case no users exist, create the super user
  sockets.initSuperUser();

});

