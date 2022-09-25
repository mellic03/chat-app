module.exports = function(db) {

  let module = {};

  module.create_user = function(username, email, password) {
    const users = db.collection("users");
    users.insertOne({
      username: username,
      email: email,
      password: password,
      role: 0,
      groups: [],
      channels: []
    });
  }

  module.delete_user = function(username) {
    const users = db.collection("users");
    users.deleteOne({username: username}, (err, res) => {
      // console.log(res);
    });
  }

  /** Add a message to the messages array of a given channel
   * @param {Object} message Message object
   * @param {string} group_name
   * @param {string} channel_name
   * @returns {null}
   */
  module.add_message_to_channel = function(message, group_name, channel_name) {

    return new Promise((resolve, reject) => {

      const channels = db.collection("channels");
      channels.findOne({name: channel_name}, (err, channel) => {
        if (err) reject(err);

        channel.messages.unshift(message);
        
        const update = {
          $set: { messages: channel.messages }
        };

        channels.updateOne({name: channel_name}, update, (err, res) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    });
  }

  /** Return an array of groups which "username" is a member of
   * @param {*} username string
   * @returns 
   */
  module.get_groups_of_user = function(username) {
    return new Promise((resolve, reject) => {

      // Open users collection
      const users = db.collection("users");
      users.findOne({username: username}, (err, usr) => {
        if (usr == null) reject("User not found");

        const groups = db.collection("groups");
        groups.find().toArray((err, group_arr) => {
          
          if (err) reject(err);

          if (usr.role >= 3) // If super, return all groups
            resolve(group_arr);

          let user_groups = [];
          let count = 0;
          let groups_length = usr.groups.length;

          group_arr.forEach(group => {
            let index = usr.groups.indexOf(group.name);
            if (index >= 0)
              user_groups.push(group);
          
            count += 1;

            if (count >= groups_length)
              resolve(true);
              
          });


        });
      });
    });
      
  }

  /** Return an array of channels which "username" is a member of
   * @param {*} username string
   * @returns 
   */
  module.get_channels_of_user = function(username) {
    return new Promise((resolve, reject) => {
      
      // Open users collection
      const users = db.collection("users");
      const channels = db.collection("channels");
      users.findOne({username: username}, (err, usr) => {
        if (err) return console.log(err);

        channels.find().toArray((err, channel_arr) => {
         
          // If super, return all channels
          if (usr.role >= 3)
            resolve(channel_arr);
      
          // Else, use user.channels array to find channels
          let count = 0;
          let length = usr.channels.length;
          let user_channels = [];
          channel_arr.forEach(channel => {
            let index = usr.channels.indexOf(channel.name);
            if (index >= 0)
              user_channels.push(channel);
            count += 1;
            if (count >= length)
              resolve(true);
          });
        });
      });
    });
  }

  /** Create a new group
   * 
   * @param group_name string
   * @return 0 on successful creation of the group, 1 if the group already exists.
   */
  module.create_group = function(group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      groups.findOne({name: group_name}, (err, res) => {
        if (res != null) resolve(false);
        else {
          groups.insertOne({name: group_name, channels: []}, (err, res) => {
            resolve(true);
          });
        }
      });
    });
  }

  module.delete_group = function(group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      groups.findOne({name: group_name}, (err, group) => {
        
        if (group == null)
          resolve(false);

        else {
          // Delete channels of group
          group.channels.forEach(channel_name => {
            module.delete_channel(channel_name, group_name).then(() => {
                
              // Delete group from user data
              db.collection("users").find().toArray((err, user_array) => {
                user_array.forEach(user => {
                  let index = user.groups.indexOf(group_name);
                  if (index >= 0)
                    user.groups.splice(index, 1);
                });
              });

            }).then(() => {
              groups.deleteOne({name: group_name}, (err, res) => {
                resolve(true);
              });
            });
          });
        }
      });
    });    
  }

  /** Retrieve a group and all of its data
   * 
   * @param {*} group_name 
   * @returns 
   */
  module.get_group = function(group_name) {

    console.log(`GROUP NAME: ${group_name}`);
    return new Promise((resolve, reject) => {
      const channels = db.collection("channels");

      db.collection("groups").findOne({name: group_name}, (err, group) => {

        if (err) reject(err);
        if (group?.channels == undefined) reject("group is null?");

        else {

          let channel_count = group.channels.length;
          let group_channels = [];
          let count = 0;
          
          group.channels.forEach(channel_name => {
            channels.findOne({name: channel_name}, (err, channel) => {
              
              if (err) reject(err);
              
              group_channels.push(channel);
              count += 1;
              
              if (count >= channel_count)
              resolve(group_channels);
            });
          });
        }
      });
    });
  }

  /** Return an array of all channel names
 * @return Array<string>
 */
  module.get_group_names = function() {
    return new Promise((resolve, reject) => {

      let group_names = [];
      let count = 0
      
      db.collection("groups").find().toArray((err, group_arr) => {
        let length = group_arr.length;
        
        group_arr.forEach(group => {
          group_names.push(group.name);

          count += 1;

          if (count >= length)
            resolve(group_names);
          
        });
      });
    });
  }

  /** Return an array of all channel names
   * @return Array<string>
   */
  module.get_channels = function() {
    return new Promise((resolve, reject) => {

      let channel_names = [];
      let count = 0
      
      db.collection("channels").find().toArray((err, channel_arr) => {
        let length = channel_arr.length;
        
        channel_arr.forEach(channel => {
          channel_names.push(channel.name);

          count += 1;

          if (count >= length)
            resolve(channel_names);
          
        });
      });
    });
  }

  module.create_channel = function(channel_name, group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");

      groups.findOne({name: group_name}, (err, group) => {
        if (group == null) reject("group doesn't exist");

        // check if channel already exists
        let index = group.channels.indexOf(channel_name);
        if (index >= 0)
          resolve(false);  

        else {
          // add channel name to channels array in group
          let channels = group.channels;
          channels.push(channel_name); 
          groups.updateOne({name: group_name}, {$set: {channels: channels}}, (err, res) => {
            // add channel to channels collection
            const channel_col = db.collection("channels");
            channel_col.insertOne({name: channel_name, messages: []}, (err, res) => {
              module.get_group(group.name).then(group => {
                resolve(group);
              });
            });
          });
        }
      });
    });
  }

  /** Delete a channel from a group
   * 
   * @param {*} channel_name 
   * @param {*} group_name 
   * @return Updated group Object
   */
  module.delete_channel = function(channel_name, group_name) {
    return new Promise((resolve, reject) => {
      
      const channels = db.collection("channels");
      const groups = db.collection("groups");
      
      channels.findOne({name: channel_name}, (err, channel) => {
        if (err) reject("channel doesn't exist");

        // Remove channel from channels collection        
        channels.deleteOne({name: channel_name}, (err, res) => {
          console.log(res);
        });

        // Remove channel name from group
        groups.findOne({name: group_name}, (err, group) => {
          if (group != null) {
            let index = group.channels.indexOf(channel_name);
            if (index >= 0)
            group.channels.splice(index, 1);
            groups.updateOne({name: group_name}, {$set: {channels: group.channels}}, (err, res) => {
              resolve(group);
            });
          }
        });

      });
    });
  }

  // Return an array of all channels of a group
  module.get_channels_of_group = function(group_name) {
    return new Promise((resolve, reject) => {

      let channels_col = db.collection("channels");
      const groups = db.collection("groups");
      let channels_of_group = [];
      let count = 0;

      groups.findOne({name: group_name}, (err, group) => {

        if (err) reject(err);

        group.channels.forEach(channel => {

          channels_col.findOne({name: channel}, (err, chnl) => {
            if (chnl != null)
              channels_of_group.push(chnl)
            count += 1;
            if (count == group.channels.length)
              resolve(channels_of_group);
          });

        });
      });
    });
  }

  /** Add user to a channel and it's parent group.
   * 
   * @param {*} username string
   * @param {*} group_name string
   * @param {*} channel_name string
   * @returns Promise
   */
  module.add_user_to_channel = function(username, group_name, channel_name) {
    return new Promise((resolve, reject) => {
      
      const users = db.collection("users");
      
      users.findOne({username: username}, (err, user) => {
        if (err) reject(err);

        let group_member = false;

        // Add group/channel name to user data
        if (user.groups.indexOf(group_name) < 0) // if not already in group
          user.groups.push(group_name);
        else
          group_member = true; 

        if (user.channels.indexOf(channel_name) < 0) // if not already in channel
          user.channels.push(channel_name);
        else
          reject("Already member of channel");

        users.updateOne({username: user.username}, {$set: {groups: user.groups, channels: user.channels}}, (err, res) => {
          resolve(true);
        });
      });
    });
  }

  module.remove_user_from_channel = function(username, group_name, channel_name) {
 
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      const channels = db.collection("channels");
      const groups = db.collection("groups");
      
      users.findOne({username: username}, (err, user) => {
        if (err) reject(err);

        index = user.channels.indexOf(channel_name);
        if (index < 0) reject("User not member of channel"); // if not member, reject
        
        user.channels.splice(index, 1);
        users.updateOne({username: username}, {$set: {channels: user.channels}}, (err, res) => {
          resolve(true);
        });
      });
    });
  }

  /** Set the system-wide permission level of a user
   * 
   * @param {*} username string
   * @param {*} role number (0-3)
   */
  module.set_role = function(username, role) {
    
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, user) => {
        if (err) reject(err);

        const update = {
          $set: {role: role}
        };

        users.updateOne({username: username}, update, (err, res) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    });
  }

  return module;
}