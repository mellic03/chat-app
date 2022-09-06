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
    let count = 0;
    fakeDB.groups.forEach(group => {
      group.channels.forEach(channel => {

        var nsp = io.of("/" + channel.name);

        nsp.on("connection", socket => {
          socket.join(channel.name);
          console.log("Connected to channel: " + channel.name);

          socket.on("message", data => {
            // console.log(data);
            // fakeDB.add_message_to_channel(data.message, data.group, data.channel);
            nsp.emit("message", data);
            // socket.to(channel.name).emit("message", data);
          });
          
          socket.on("unsubscribe", () => {
            console.log(`socket leaving channel: ${channel.name}`);
            socket.leave(nsp);
          })

        });

        count++;
      })
    });
    //---------------------------------------------------------------------



    io.on("connection", (socket) => {

      console.log(`Connection on port ${PORT}:${socket.id}`);

      // Upon receiving a message, update the message array then emit the message.
      socket.on("message", (message) => {
        console.log("main")
        // fakeDB.add_message_to_channel(message.message, message.group, message.channel);
        io.emit("message", message);
      });
    });


    // Socket channel for admin tasks.
    system = io.of("admin");
    system.on("connection", socket => {

      socket.on("create_user", (data) => {
        fakeDB.create_user(data.username, data.email, data.password);
      });

      socket.on("delete_user", (data) => {
        // fakeDB.delete_user(data.user_id);
      });

      socket.on("set_role", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
      });

      socket.on("create_group", (data) => {
        fakeDB.create_group(data.group_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });
      
      socket.on("delete_group", (data) => {
        fakeDB.delete_group(data.group_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("add_user_to_group", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
        // io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("remove_user_from_group", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
        // io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("create_channel", (data) => {
        fakeDB.create_channel(data.channel_name, data.group_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("delete_channel", (data) => {
        fakeDB.delete_channel(data.channel_name, data.group_name)
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("add_user_to_channel", (data) => {
        fakeDB.add_user_to_channel(data.username, data.group_name, data.channel_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

      socket.on("remove_user_from_channel", (data) => {
        fakeDB.remove_user_from_channel(data.username, data.group_name, data.channel_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });

    });
  
  }
}