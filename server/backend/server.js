const express = require('express');
const app = express();

const cors = require('cors');
const cors_options = {
    origin: ['*', '/', '/backend'],
    methods: "POST, GET, PUT, OPTIONS, DELETE"
};
app.use(cors(cors_options));

const fs = require('fs');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require("https");
const PORT = 3001;
const httpsOptions = {
    key:  fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};
const httpsServer = https.createServer(httpsOptions, app);


httpsServer.listen(PORT, () => {
    console.log("Server running on " + PORT);
});

const io = require('socket.io')(httpsServer);

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://mongodocker:27017/";
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


/*

docker stop $(docker ps -a -q)
docker rmi -f $(docker images -aq)

docker exec -it ngserver bash


#!/bin/bash

docker run --network=chat-net --name=pp -p 80:80 -p 443:443 -d proxy
docker run --network=chat-net --name=mongodocker -p 27017:27017 -d mongo:4.10.0
docker run --network=chat-net --name=mongoexpress -e ME_CONFIG_MONGODB_SERVER=mongodocker -p 8081:8081 -d mongo-express
docker run --network=chat-net --name=frontend -p 4201:4201 -d mellic03/ng-server
docker run --network=chat-net --name=backend -p 3001:3001 -d mellic03/mongo-server

docker build -t proxy .

*/