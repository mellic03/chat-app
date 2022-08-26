const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const path = require('path');

app.use(express.static(path.join(__dirname, '/../dist/chat-app')));
app.use(bodyparser.json());
app.use(cors());

const PORT = 4200;
const server = http.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Server running on " + PORT);
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname,'/../dist/chat-app/index.html'));
});
app.get('/login', (req,res) =>{
  res.sendFile(path.join(__dirname,'/../dist/chat-app/index.html'));
});