const express = require('express');
const app = express();

const cors = require('cors');
const cors_options = {
    origin: ['*', '/', '/backend'],
    methods: "POST, GET, PUT, OPTIONS, DELETE"
};
app.use(cors(cors_options));


app.set("trust proxy", true);


const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require('https');
const PORT = 4201;
const httpsOptions = {
    key:  fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};
const httpsServer = https.createServer(httpsOptions, app);


// Use absolute paths for sendFile
app.get('*', cors(cors_options), (req, res) => {
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});
app.get('/login', cors(cors_options), (req, res) => {
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});

app.use(express.static("./dist/chat-app"));

httpsServer.listen(PORT, () => {
    console.log("Server running on " + PORT);
});
