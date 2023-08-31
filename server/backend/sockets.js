const { resolve } = require('dns');

module.exports = function(MongoClient, app) {

  const DB = require("./DB/mongodb")(MongoClient);

  let module = {};

    module.initSuperUser = function() {
        DB.create_user("super", "super@mail.com", "superpass").catch((err) => {
            console.log(err);
            DB.set_role("super", 3, "");
        }).then((usr_array) => {
            DB.set_role("super", 3, "");
        });
    };

    module.connect = function(io, PORT, app) {

    init_channel = function(group_name, channel_name) {
      let channel_path = group_name + '/' + channel_name;
      let no_whitespace = channel_path.replace(/\s/g, '-');
      const socket_channel = io.of(no_whitespace);

      socket_channel.on("connection", socket => {

        // console.log("socket joining channel: " + no_whitespace);
        socket.join(socket_channel);
        
        app.post(`/api/groups/${no_whitespace}/add_image`, (req, res) => {
          const reqdata = req.body;
          socket_channel.to(socket_channel).emit("message", reqdata);

          DB.add_message_to_channel(reqdata.message, reqdata.group_name, reqdata.channel_name).then(() => {
           
            DB.get_group(reqdata.group_name).then((group) => {
              // console.log(`emitting to ${reqdata.group_name}`);
              socket_channel.emit(reqdata.group_name, group);
              res.send({response: "received"});
            });

          }).catch((err) => {
            console.log(err);
          });
        });
      

        // On message, add to correct channel and re-emit
        socket.on("message", (data) => {
          // console.log(data);
          socket_channel.to(socket_channel).emit("message", data);

          DB.add_message_to_channel(data.message, data.group_name, data.channel_name).then((res) => {
            if (res == false) {
              console.log("Failed adding message to " + channel_path);
            }
           
            else {
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
          console.log(err);
          io.emit(`${data.executor}/create_user`, false);
        }).then((usr_array) => {
          io.emit(`${data.executor}/create_user`, usr_array);
        });
      });



      socket.on("delete_user", (data) => {
        DB.delete_user(data.username).then(usr_array => {
          if (usr_array == false)
            console.log("User already exists");
          else
            io.emit(`${data.executor}/delete_user`, usr_array);
        });
      });



      socket.on("update_user_credentials", (data) => {
        console.log(data);
        DB.update_user_credentials(data.email, data.password, data.executor).catch((err) => {
          console.log(err);
        }).then((response) => {
          io.emit(`${data.executor}/update_user_credentials`, response);
        });
      });



      socket.on("set_role", (data) => {
        // If group assistant or group admin, also pass grop
        if (data.role == 1 || data.role == 2) {
          DB.set_role(data.username, data.role, data.group).then(response => {
            io.emit(`${data.executor}/set_role`, true);
          });
        }
        else {
          DB.set_role(data.username, data.role, "");
          io.emit(`${data.executor}/set_role`, true);
        }
      });



      // Emit an updated list of group names on successful creation of a group
      // If the group already exists, emit false
      socket.on("create_group", (data) => {
        DB.create_group(data.group_name).then((group_names) => {
          io.emit(`${data.executor}/group_created`, group_names);
        }).catch((err) => {
          console.log(err);
          io.emit(`${data.executor}/group_not_created`, false);
        });
      });
      


      socket.on("delete_group", (data) => {
        DB.delete_group(data.group_name).catch((err) => {
          console.log(err);
          io.emit(`${data.executor}/create_group`, false);
        }).then((group_names) => {
          io.emit(`${data.executor}/delete_group`, group_names);
        });
      });



      socket.on("add_user_to_group", (data) => {

        DB.add_user_to_group(data.username, data.group_name).then(() => {
          DB.get_group(data.group_name).then((group) => {
            io.emit(data.group_name, group);
            io.emit(`${data.executor}/add_user_to_group`, true);
          });
        }).catch((err) => {
          console.log(err);
          io.emit(`${data.executor}/add_user_to_group`, false);
        });

      });



      socket.on("remove_user_from_group", (data) => {
        DB.remove_user_from_group(data.username, data.group_name).then((response) => {
          DB.get_group(data.group_name).then((group) => {
            io.emit(data.group_name, group);
            io.emit(`${data.executor}/remove_user_from_group`, true);
          });

        }).catch((err) => {
          console.log(err);
          io.emit(`${data.executor}/remove_user_from_group`, false);
        });
      });



      socket.on("create_channel", (data) => {
        console.log("Creating channel");
        DB.create_channel(data.channel_name, data.group_name).then((group) => {
          if (group == false)
            console.log("Channel already exists.");
          else {
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

        DB.add_user_to_channel(data.username, data.group_name, data.channel_name).then((channel) => {
          io.emit(data.group_name + '/' + data.channel_name, channel); // Update for everone else
          io.emit(`${data.executor}/add_user_to_channel`, true); // success message for executor
          console.log("emitting");
        }).catch((err) => {
          console.log(err + "YEEAAHH");
          io.emit(`${data.executor}/add_user_to_channel`, false); // failure message for executor
        });
      });



      socket.on("remove_user_from_channel", (data) => {
        DB.remove_user_from_channel(data.username, data.group_name, data.channel_name).then((channel) => {
          io.emit(data.group_name + '/' + data.channel_name, channel);
          io.emit(`${data.executor}/remove_user_from_channel`, true); // success message for executor
        }).catch((err) => {
          console.log(err); 
          io.emit(`${data.executor}/remove_user_from_channel`, false); // failure message for executor
        });
      });



      socket.on("update_pFcrr_id", (data) => {
        DB.update_peer_id(data.username, data.peer_id).then((user) => {
          console.log(user);
        });
      });

    });
  };

  return module;
}