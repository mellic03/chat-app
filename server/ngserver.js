const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const https = require("https");
const path = require('path');
const fs = require("fs");

app.use(express.static(path.join(__dirname, '/../dist/chat-app')));
app.use(bodyparser.json());
app.use(cors());

const PORT = 4200;

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem")
};

const httpsServer = https.createServer(options, app);

httpsServer.listen(PORT, () => {
  let host = httpsServer.address().address;
  let port = httpsServer.address().port;
  console.log("Server running on " + PORT);
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname,'/../dist/chat-app/index.html'));
});
app.get('/login', (req,res) =>{
  res.sendFile(path.join(__dirname,'/../dist/chat-app/index.html'));
});