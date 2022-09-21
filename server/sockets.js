const fakeDB = require('./fakeDB/fakeDB');

let channels = [];

module.exports = {

  connect: function(io, PORT) {

    fakeDB.groups.forEach(group => {
      group.channels.forEach(channel => {
        
        let no_whitespace = channel.name.replace(/\s/g, '');
        const socket_channel = io.of(no_whitespace);

        socket_channel.on("connection", socket => {
          console.log(`socket joining channel: ${no_whitespace}`);
          socket.join(socket_channel);
          

          // On message, add to correct channel and re-emit
          socket.on("message", (data) => {
            console.log(data.message);
            console.log(data.channel_name);
            fakeDB.add_message_to_channel(data.message, data.group_name, data.channel_name);
            socket_channel.to(socket_channel).emit("message", data);
            socket_channel.emit(data.group_name, fakeDB.get_group(data.group_name));
          });
          
          socket.on("unsubscribe", () => {
            console.log(`socket leaving channel: ${no_whitespace}`);
            socket.leave(socket_channel);
          });

        });
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
    let system = io.of("admin");
    system.on("connection", socket => {

      socket.on("create_user", (data) => {
        fakeDB.create_user(data.username, data.email, data.password);
        io.emit("users", fakeDB.users); // Emit all user data
      });

      socket.on("delete_user", (data) => {
        fakeDB.delete_user(data.username);
        io.emit("users", fakeDB.users); // Emit all user data
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