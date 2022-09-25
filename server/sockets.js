const { resolve } = require('dns');
const fakeDB = require('./fakeDB/fakeDB');

let channels = [];






module.exports = function(MongoClient) {

  const DB = require("./DB/mongodb")(MongoClient);

  let module = {};

  module.connect = function(io, PORT) {

    init_channel = function(channel_name) {
      let no_whitespace = channel_name.replace(/\s/g, '-');
      const socket_channel = io.of(no_whitespace);
      
      socket_channel.on("connection", socket => {
        console.log(`socket joining channel: ${no_whitespace}`);
        socket.join(socket_channel);
        
        // On message, add to correct channel and re-emit
        socket.on("message", (data) => {
          console.log(data.message);
          console.log(data.channel_name);
    
          DB.add_message_to_channel(data.message, data.group_name, data.channel_name);
    
          socket_channel.to(socket_channel).emit("message", data);
    
          DB.get_group(data.group_name).then((group) => {
            socket_channel.emit(data.group_name, group);
          }).catch(err => {
            console.log(err);
          });
        });
        
        socket.on("unsubscribe", () => {
          console.log(`socket leaving channel: ${no_whitespace}`);
          socket.leave(socket_channel);
        });
      });
    }

    DB.get_channels().then(channel_names => {
      channel_names.forEach(channel_name => {
        init_channel(channel_name);
      });
    });
        
    //---------------------------------------------------------------------

    // io.on("connection", (socket) => {
    //   console.log(`Connection on port ${PORT}:${socket.id}`);
    //   // Upon receiving a message, update the message array then emit the message.
    //   socket.on("message", (message) => {
    //     // fakeDB.add_message_to_channel(message.message, message.group, message.channel);
    //     io.emit("message", message);
    //   });
    // });

    // Socket channel for admin tasks.
    let system = io.of("admin");
    system.on("connection", socket => {



      socket.on("create_user", (data) => {
        DB.create_user(data.username, data.email, data.password);
        // fakeDB.create_user(data.username, data.email, data.password);
        io.emit("users", fakeDB.users); // Emit all user data
      });



      socket.on("delete_user", (data) => {
        DB.delete_user(data.username);
        // fakeDB.delete_user(data.username);
        io.emit("users", fakeDB.users); // Emit all user data
      });



      socket.on("set_role", (data) => {
        DB.set_role(data.username, data.role);
        // fakeDB.set_role(data.user_id, data.role);
      });



      socket.on("create_group", (data) => {
        DB.create_group(data.group_name).then(res => {
          if (res == false)
            console.log(`Group '${data.group_name}' already exists`);
          else
            console.log(`Group '${data.group_name}' created successfully`);
        });
      });
      


      socket.on("delete_group", (data) => {
        DB.delete_group(data.group_name).then(res => {
          if (!res) console.log(`Group '${data.group_name}' doesn't exist.`)
        });
      });



      socket.on("add_user_to_group", (data) => {
        // DB.add_user_to_group(data.username, data.role);
        // fakeDB.set_role(data.user_id, data.role);
        // io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });



      socket.on("remove_user_from_group", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
        // io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });



      socket.on("create_channel", (data) => {

        DB.create_channel(data.channel_name, data.group_name).catch((err) => {
          console.log(err);
        }).then((group) => {
          
          if (group == false)
            console.log("Channel already exists.");

          else {
            init_channel(data.channel_name);
          }

          console.log("repsonse: " + group);
          io.emit(data.group_name, group);
        });
      });



      socket.on("delete_channel", (data) => {
        DB.delete_channel(data.channel_name, data.group_name).then((group) => {
          console.log(group);
          io.emit(data.group_name, group);
        });
      });



      socket.on("add_user_to_channel", (data) => {
        DB.add_user_to_channel(data.username, data.group_name, data.channel_name).catch((err) => {
          console.log(err);
        });
        // fakeDB.add_user_to_channel(data.username, data.group_name, data.channel_name);
        io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });



      socket.on("remove_user_from_channel", (data) => {
        DB.remove_user_from_channel(data.username, data.group_name, data.channel_name).catch((err) => {
          console.log(err);
        }).then(() => {
          io.emit();
          // io.emit(data.group_name, fakeDB.get_group(data.group_name));
        });
      });



    });
  };

  return module;
}