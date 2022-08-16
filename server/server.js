const fs = require('fs');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
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


let users = JSON.parse(fs.readFileSync(__dirname + "/users.json"));

app.post('/api/auth', (req, res) => {
  users.forEach((user) => {
    if (req.body.email == user.email && req.body.password == user.password) {
      res.send(user);
      return;
    }
  });

  res.send({valid: false});

});
