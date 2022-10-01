const { resolve } = require('dns');

module.exports = function(MongoClient) {

  const DB = require("./DB/mongodb")(MongoClient);

  let module = {};

  module.connect = function(io, PORT) {

    init_channel = function(group_name, channel_name) {
      let channel_path = group_name + '/' + channel_name;
      let no_whitespace = channel_path.replace(/\s/g, '-');
      const socket_channel = io.of(no_whitespace);

      socket_channel.on("connection", socket => {

        console.log("socket joining channel: " + no_whitespace);
        socket.join(socket_channel);
        
        // On message, add to correct channel and re-emit
        socket.on("message", (data) => {
          console.log(data);
    
          DB.add_message_to_channel(data.message, data.group_name, data.channel_name).then((res) => {
            if (res == false) {
              console.log("Failed adding message to " + channel_path);
            }
           
            else {
              socket_channel.to(socket_channel).emit("message", data);
              DB.get_group(data.group_name).then((group) => {
                socket_channel.emit(data.group_name, group);
              }).catch(err => {
                console.log(err);
              });
            }
          });

        });
        
        socket.on("unsubscribe", () => {
          console.log(`socket leaving channel: ${no_whitespace}`);
          socket.leave(socket_channel);
        });
      });
    }

    DB.get_channels().then(channels => {
      channels.forEach(channel => {
        init_channel(channel.parent_group, channel.name);
      });
    });
        
    //---------------------------------------------------------------------

    // Socket channel for admin tasks.
    let system = io.of("admin");
    system.on("connection", socket => {



      socket.on("create_user", (data) => {
        DB.create_user(data.username, data.email, data.password).catch((err) => {
          console.log(data.executor);
          io.emit(`${data.executor}/create_user`, false);
        }).then((usr_array) => {
          io.emit("users", usr_array);
        });
      });



      socket.on("delete_user", (data) => {
        DB.delete_user(data.username).then(usr_array => {
          if (usr_array == false)
            console.log("User already exists");
          else
            io.emit("users", usr_array);
        });
      });



      socket.on("set_role", (data) => {
        DB.set_role(data.username, data.role);
      });



      // Emit an updated list of group names on successful creation of a group
      // If the group already exists, emit false
      socket.on("create_group", (data) => {
        DB.create_group(data.group_name).catch((err) => {
          console.log(err);
          io.emit(`${data.executor}/group_names`, false);
        }).then((groups) => {
          io.emit(`${data.executor}/group_names`, groups);
        });
      });
      


      socket.on("delete_group", (data) => {
        DB.delete_group(data.group_name).then((groups) => {
          if (groups == false)
            console.log(`Group '${data.group_name}' doesn't exist.`)
          else
            io.emit("group names", groups);
        });
      });



      socket.on("add_user_to_group", (data) => {
        DB.add_user_to_group(data.username, data.group_name).catch((err) => {
          console.log(err);
        }).then((group) => {
          io.emit(data.group_name, DB.get_group(data.group_name));
        });
      });



      socket.on("remove_user_from_group", (data) => {
        // fakeDB.set_role(data.user_id, data.role);
        // io.emit(data.group_name, fakeDB.get_group(data.group_name));
      });



      socket.on("create_channel", (data) => {

        DB.create_channel(data.channel_name, data.group_name).then((group) => {
          if (group == false)
            console.log("Channel already exists.");
          else {
            console.log("channel created");
            init_channel(data.group_name, data.channel_name);
            io.emit(data.group_name, group);
          }
        });
      });



      socket.on("delete_channel", (data) => {
        console.log(data);
        DB.delete_channel(data.channel_name, data.group_name).then((group) => {
          if (group == false)
            console.log("Channel doesn't exist.");
          else {
            io.emit(data.group_name, group);
          }
        });
      });



      socket.on("add_user_to_channel", (data) => {

        DB.add_user_to_channel(data.username, data.group_name, data.channel_name).catch((err) => {
          console.log(err);
        }).then((channel) => {
          io.emit(data.group_name + '/' + data.channel_name, channel);
        });
      });



      socket.on("remove_user_from_channel", (data) => {
        DB.remove_user_from_channel(data.username, data.group_name, data.channel_name).catch((err) => {
          console.log(err); 
        }).then((channel) => {
          io.emit(data.group_name + '/' + data.channel_name, channel);
        });
      });



      socket.on("update_peer_id", (data) => {
        DB.update_peer_id(data.username, data.peer_id).then((user) => {
          console.log(user);
        });
      });

    });
  };

  return module;
}