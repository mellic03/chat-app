const express = require('express');
const app = express();

const cors = require('cors');
const cors_options = {
    origin: ['*', 'ngserver:4200', 'mongoserver:3000'],
    methods: "POST, GET, PUT, OPTIONS, DELETE"
};
app.use(cors(cors_options));

const fs = require('fs');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require("https");
const PORT = 3000;
const httpsOptions = {
    key:  fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};
const httpsServer = https.createServer(httpsOptions, app);

app.use(express.json({limit: "25mb"}));

httpsServer.listen(PORT, () => {
    console.log("Server running on " + PORT);
});

const io = require('socket.io')(httpsServer);

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://mongodocker:27017";
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

docker exec -it test bash

*/