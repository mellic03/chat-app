const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(bodyparser.json());
app.use(cors());

const http = require('http').Server(app);
app.use(express.static(path.join(__dirname, "/../dist/chat-app/index.html")));


const PORT = 4200;
const server = http.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Server running on " + PORT);
});


app.get('/', (req, res) => {
  res.sendFile(path.join("/home/michael/Desktop/code/Uni/Software Frameworks/Milestone 1/chat-app/dist/chat-app/index.html"));
})