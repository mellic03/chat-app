const fakeDB = require('./fakeDB/fakeDB');

module.exports = {

  connect: function(io, PORT) {
    io.on("connection", (socket) => {
      console.log(`Connection on port ${PORT}:${socket.id}`);

      // Upon receiving a message, update the message array then emit the message.
      
      socket.on("message", (message) => {
        fakeDB.add_message_to_group(message.message, message.group);
        io.emit("message", message);
      })
    })
  }
}