const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require("http");
const path = require('path');
const fs = require("fs");

app.use(express.static(path.join(__dirname, './dist/chat-app')));
app.use(bodyparser.json());
app.use(cors());

const PORT = 4200;

// const options = {
//   key: fs.readFileSync("./key.pem"),
//   cert: fs.readFileSync("./cert.pem")
// };
// const httpServer = http.createServer(options, app);

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  let host = httpServer.address().address;
  let port = httpServer.address().port;
  console.log("Server running on " + PORT);
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});
app.get('/login', (req,res) =>{
  res.sendFile(path.join(__dirname,'./dist/chat-app/index.html'));
});