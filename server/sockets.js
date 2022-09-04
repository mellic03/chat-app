const fakeDB = require('./fakeDB/fakeDB');

let channels = [];

module.exports = {

  connect: function(io, PORT) {

    // Define function on "connection" and on "message" for each channel.
    //---------------------------------------------------------------------
    // Not sure if I need to push the channels to an array for later use.
    // let count = 0;
    // for (let i=0; i<fakeDB.groups.length; i++) {
    //   for (let j=0; j<fakeDB.groups[i].channels.length; j++) {

    //     channels[count] = io.of("/" + fakeDB.groups[i].channels[j].name);
    //     channels[count].on("connection", socket => {
    //       console.log(`Connected to channel: ${fakeDB.groups[i].channels[j].name}`);
  
    //       socket.on("message", data => {
    //         console.log(data);
    //       });
    //     });

    //     count++;
    //   }
    // }
    
    fakeDB.groups.forEach(group => {
      group.channels.forEach(channel => {
        let socket_channel = io.of("/" + channel.name);
        socket_channel.on("connection", socket => {
          socket.join(channel.name);
          // console.log("Connected to channel: " + channel.name);

          socket.on("message", data => {
            // console.log(data);
            // fakeDB.add_message_to_channel(data.message, data.group, data.channel);
            socket.emit("message", data);
            // socket.to(channel.name).emit("message", data);
          });

          socket.leave(channel.name);
        });
      })
    });
    //---------------------------------------------------------------------



    io.on("connection", (socket) => {

      console.log(`Connection on port ${PORT}:${socket.id}`);

      // Upon receiving a message, update the message array then emit the message.
      socket.on("message", (message) => {
        fakeDB.add_message_to_channel(message.message, message.group, message.channel);
        io.emit("message", message);
      });
    });


    // Socket channel for admin tasks.
    system = io.of("system");
    system.on("connection", socket => {

      socket.on("create_user", (data) => {
        // fakeDB.create_user(data.username, data.email, data.password);
      });

      socket.on("delete_user", (data) => {
        // fakeDB.delete_user(data.user_id);
      });

      socket.on("set_role", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
      });

    });
  
  }
}