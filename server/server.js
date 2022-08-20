const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const e = require('express');
const app = express();
const http = require('http').Server(app);

app.use(bodyparser.json());
app.use(cors());

const PORT = 3000;
const server = http.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Server running on " + PORT);
});


// Written for this server
//-----------------------------
require('./routes')(app);
//-----------------------------



