const express = require('express');
const app = express();

const cors = require('cors');
const cors_options = {
    origin: ['*', 'ngserver:4200', 'mongoserver:3000'],
    methods: "POST, GET, PUT, OPTIONS, DELETE"
};
app.use(cors(cors_options));

const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require('https');
const PORT = 4200;
const httpsOptions = {
    key:  fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};
const httpsServer = https.createServer(httpsOptions, app);

// Serve static files after body parser
app.use(express.static("./dist/chat-app"));

httpsServer.listen(PORT, () => {
    console.log("Server running on " + PORT);
});

// Use absolute paths for sendFile
app.get('*', cors(cors_options), (req, res) => {
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});
app.get('/login', cors(cors_options), (req, res) => {
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});
