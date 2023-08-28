const fs = require("fs");
const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 3001,
  path: "/",
  ssl: {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
  }
});
