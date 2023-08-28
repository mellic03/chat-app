module.exports = function(db) {

  let module = {};

  module.verify_user = function(email, password) {
    return new Promise((resolve, reject) => {
      
      const users = db.collection("users");
      users.findOne({email: email, password: password}, (err, usr) => {
        if (usr == null)
          resolve(false);
        else
          resolve(usr);
      });
    });
  }

  module.create_user = function(username, email, password) {
    return new Promise((resolve, reject) => {

      const users = db.collection("users");

      const new_user = {
        username: username,
        email: email,
        password: password,
        profile_photo: undefined,
        role: 0,
        groups: [],
        permission_levels: {}
      };

      users.findOne({username: username}, (err, usr) => {

        if (err || usr != null) {
          reject(`User with username "${username}" already exists`);
        }

        else {
          users.insertOne(new_user, (err, res) => {
            users.find({}).toArray((err, usr_array) => {
              resolve(usr_array);
            })
          });
        }

      });
    });
  }

  module.delete_user = function(username) {

    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, usr) => {
        // if usr doesn't exist
        if (usr == null)
          resolve(false);
        else {
          users.deleteOne({username: username}, (err, res) => {
            users.find().toArray((err, usr_array) => {
              resolve(usr_array);
            });
          });
        }
      });

    });
  }

  /** Update the email address and password of a user
   * 
   * @param {*} email New email address of user
   * @param {*} password New password of user
   * @param {*} username Username of user
   * @returns resolve(  { email: email, password: password }  )
   */
  module.update_user_credentials = function(email, password, username) {
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, usr) => {
        const update = {
          $set: {
            email: email,
            password: password
          }
        };
        users.updateOne({username: username}, update, (err, res) => {
          resolve({email: email, password: password});
        });
      });
    });
  }

  module.get_user = function(username) {
 
    return new Promise((resolve, reject) => {
      db.collection("users").findOne({username: username}, (err, usr) => {
        if (usr != null) {
          usr.password = "";
          resolve(usr);
        }
        else
          reject(false);
      });
    });
  }

  module.update_profile_photo = function(username, image) {
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, res) => {
        if (err) reject(err);
        else {
          const update = {
            $set: {profile_photo: image}
          }
          users.updateOne({username: username}, update, (err, res) => {
            resolve(image);
          });
        }
      });
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
      channels.findOne({name: channel_name, parent_group: group_name}, (err, channel) => {
        if (channel == null) {
          console.log(`channel '${channel_name}' not found in database (module.add_message_to_channel())`);
          resolve(false);
        }
        else {

          channel.messages.unshift(message);
          
          const update = {
            $set: { messages: channel.messages }
          };
          
          channels.updateOne({name: channel_name, parent_group: group_name}, update, (err, res) => {
            if (err) reject(err);
            resolve(true);
          });
        }
      });
    });
  }

  /** Return an array of groups which "username" is a member of
   * @param {*} username string
   * @returns 
   */
  module.get_groups_of_user = function(username) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      const users = db.collection("users");
      
      // Check user role, if super, return all groups
      users.findOne({username: username}, (err, usr) => {
        if (usr.role >= 3) {
          groups.find().toArray((err, group_arr) => {
            let count = 0;
            let len = group_arr.length;
            group_arr.forEach((group) => {
              users.find({ $or: [ {groups: {$all: [group.name]}}, {role: 3} ] }).toArray((err, user_arr) => {
                group.users = user_arr;
                count++;
                if (count >= len)
                  resolve(group_arr);
              });
            });
          });
        }

        else {
          groups.find({users: {$all: [username]}}).toArray((err, group_arr) => {
            // Find all uses which belong to each group, also include users with role == 3
            let count = 0;
            let len = group_arr.length;
            group_arr.forEach((group) => {
              users.find({ $or: [ {groups: {$all: [group.name]}}, {role: 3} ] }).toArray((err, user_arr) => {
                group.users = user_arr;
                count++;
                if (count >= len)
                  resolve(group_arr);
              });
            });
          });     
        }
      });
    });
      
  }

  /** Return an array of channels a user is a member of
   * 
   * @param {*} username 
   * @returns 
   */
  module.get_channels_of_user = function(username) {
    return new Promise((resolve, reject) => {
      const channels = db.collection("channels");
      const users = db.collection("users");

      // Find user info to check if super
      users.findOne({username: username}, (err, user) => {
        if (user == null) {
          reject(`User: '${username}' not found`);
        }
        else if (user.role >= 3) {
          channels.find().toArray((err, channel_arr) => {
            resolve(channel_arr);
          });
        }
        else {
          channels.find({users: {$all: [username]}}).toArray((err, channel_arr) => {
            resolve(channel_arr);
          });
        }
      });
    });
  }

  /** Create a new group in the database and return the new list of all group names
   * @param group_name string
   * @returns Array<string> on success, reject(string) on failure 
   */
  module.create_group = function(group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      groups.findOne({name: group_name}, (err, res) => {
        if (res != null) {
          reject(`Group: '${group_name}' already exists`);
        }
        else {
          groups.insertOne({name: group_name, users: [], channels: []}, (err, res) => {
            module.get_group_names().then((names) => {
              resolve(names);
            })
          });
        }
      });
    });
  }

  /** Delete a group from the database and return the new list of all group names
   * @param {*} group_name string
   * @returns Array<string> on success, reject(string) on failure
   */
  module.delete_group = function(group_name) {
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      const groups = db.collection("groups");
      const channels = db.collection("channels");
      groups.findOne({name: group_name}, (err, group) => {
        if (group == null) {
          reject(`Cannot find group: ${group_name}`);
        }
        
        else {
          // console.log(group_name);
          // Delete group name from all user.groups
          users.find({groups: {$all: [group_name]}}).toArray((err, user_arr) => {
            user_arr.forEach(user => {
              user.groups.splice(user.groups.indexOf(group_name));
            });

            // Delete all channels of group
            channels.deleteMany({parent_group: group_name}).then(() => {
              // Delete group
              groups.deleteOne({name: group_name}, (err, res) => {
                // Return new list of group names
                module.get_group_names().then(names => {
                  resolve(names);
                });
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

    // console.log(`GROUP NAME: ${group_name}`);
    return new Promise((resolve, reject) => {
      const channels = db.collection("channels");
      const users = db.collection("users");

      db.collection("groups").findOne({name: group_name}, (err, group) => {

        if (err) reject(err);
        if (group?.channels == undefined) reject("group is null?");

        else {
          
          group.users = [];
          group.channels = [];

          users.find({groups: {$all: [group_name]}}).toArray((err, res) => {
            group.users = res;
            
            channels.find({parent_group: group_name}).toArray((err, chnls) => {
              group.channels = chnls;
              resolve(group);
            });
          });
        }
      });
    });
  }

  /** Return an array of users of a given group
   * 
   * @param {*} group_name 
   */
  module.get_users_of_group = function(group_name) {
    return new Promise((resolve, reject) => {

      const groups = db.collection("groups");
      const users = db.collection("users");
      
      users.find({groups: {$all: [group_name]}}).toArray((err, user_arr) => {
        if (user_arr.length > 0) {
          resolve(user_arr);
        }
        else {
          reject(`No users found with group: "${group_name}" in user.groups`);
        }
      });
      
    });
  }

  /** Return an array of all group names
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

  /** Update a group photo
   * @param group_name
   * @param image
   * @returns 
   */
  module.update_group_photo = function(group_name, image) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      groups.findOne({name: group_name}, (err, group) => {
        groups.updateOne({name: group_name}, {$set: {image: image}}, (err, res) => {
          resolve(true);
        });
      });
    });
  }

  /** Return an array of all channels
   * @return Array<string>
   */
  module.get_channels = function() {
    return new Promise((resolve, reject) => {
      db.collection("channels").find().toArray((err, channel_arr) => {
        resolve(channel_arr);
      });
    });
  }

  module.create_channel = function(channel_name, group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      const channel_col = db.collection("channels");

      // Check if channel already exists
      channel_col.findOne({name: channel_name, parent_group: group_name}, (err, chnl) => {

        if (chnl != null) {
          resolve(false);
        }

        else {
          groups.findOne({name: group_name}, (err, group) => {
            if (group == null) {
              resolve(false);
            }

            else {
              // Add channel name to channels array in group
              group.channels.push(channel_name);
              const set_value = { $set: {channels: group.channels} };
              
              groups.updateOne({name: group_name}, set_value, (err, res) => {
                // Add channel to channels collection
                const new_channel = {
                  name: channel_name,
                  parent_group: group_name,
                  users: [],
                  messages: []
                };
                
                channel_col.insertOne(new_channel, (err, res) => {
                  module.get_group(group.name).then(group => {
                    resolve(group);
                  });
                });
              });
            }
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
      
      channels.findOne({name: channel_name, parent_group: group_name}, (err, channel) => {
        if (err) reject("channel doesn't exist");

        // Remove channel from channels collection        
        channels.deleteOne({name: channel_name, parent_group: group_name}, (err, res) => {
          // console.log(res);

          // Remove channel name from group
          groups.findOne({name: group_name}, (err, group) => {
            if (group != null) {
              let index = group.channels.indexOf(channel_name);
              if (index >= 0) {
                group.channels.splice(index, 1);
                groups.updateOne({name: group_name}, {$set: {channels: group.channels}}, (err, res) => {
                  module.get_group(group.name).then(group => {
                    resolve(group);
                  });
                });
              }
              else {
                module.get_group(group.name).then(group => {
                  resolve(group);
                });
              }
            }
          });

        });

      });
    });
  }

  // Return an array of all channels of a group
  module.get_channels_of_group = function(group_name) {
    return new Promise((resolve, reject) => {
      const channels = db.collection("channels");
      channels.find({parent_group: group_name}).toArray((err, res) => {
        resolve(res);
      });
    });
  }

  /** Add a user to a group
   * @param {*} username Username of user to add
   * @param {*} group_name Name of group to add to
   */
  module.add_user_to_group = function(username, group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      const users = db.collection("users");
      groups.findOne({name: group_name}, (err, group) => {
        
        if (group == null) {
          reject(`Cannot find group: ${group_name}`);
        }
        else {
          
          // Check if user is already member of group
          let index = group.users.indexOf(username);
          if (index >= 0) {
            reject(`${username} already in ${group_name}.users`);
          }
          
          else {
            group.users.push(username);
            // Add user to group
            groups.updateOne({name: group_name}, {$set: {users: group.users}}, (err, res) => {
              // Add group to user's groups array
              users.findOne({username: username}, (err, usr) => {
                usr.groups.push(group_name);
                users.updateOne({username: username}, {$set: {groups: usr.groups}}, (err, res) => {
                  resolve(true);
                });
              });
            });
          }
        }

      });
    });
  }

  /** Remove a user from a group
   * @param {*} username username of the user to remove
   * @param {*} group_name name of the group to remove from
   */
  module.remove_user_from_group = function(username, group_name) {
    return new Promise((resolve, reject) => {
      const groups = db.collection("groups");
      const channels = db.collection("channels");
    
      // Find all channels in group_name and remove username from channel.users
      channels.find({ $and: [ {users: {$all: [username]}}, {parent_group: group_name} ] }).toArray((err, chnls) => {
        chnls.forEach((channel) => {
          channel.users.splice(channel.users.indexOf(username), 1);
          channels.updateOne({parent_group: group_name, name: channel.name}, {
            $set: {users: channel.users}
          });
        });
      });

      // Find and remove user from group
      groups.findOne({name: group_name}, (err, group) => {
        let index = group.users.indexOf(username);
        if (index < 0) {
          reject(`Cannot find user: ${username} in group: ${group_name}`);
        }
        else {
          group.users.splice(index, 1);
          groups.updateOne({name: group_name}, {
            $set: {users: group.users}
          }, (err, response) => {
            resolve(true);
          });
        }
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
      const channels = db.collection("channels");
      const groups = db.collection("groups");
      
      users.findOne({username: username}, (err, user) => {
        if (user.groups.indexOf(group_name) < 0) {
          user.groups.push(group_name);
        }
        users.updateOne({username: username}, {$set: {groups: user.groups}}, (err, res) => {

          groups.findOne({name: group_name}, (err, group) => {
            if (group == null) {
              reject(`Could not find group: '${group_name}'`);
            }
            else {
              if (group.users.indexOf(username) < 0) {
                group.users.push(username);
              }
              groups.updateOne({name: group_name}, {$set: {users: group.users}}, (err, res) => {
                channels.findOne({name: channel_name, parent_group: group_name}, (err, channel) => {
                  if (channel == null) {
                    reject(`Could not find channel: '${channel_name}' with parent group: '${group_name}'`);
                  }
                  else {
                    if (channel.users.indexOf(username) < 0) {
                      channel.users.push(username);
                      channels.updateOne({name: channel_name}, {$set: {users: channel.users}}, (err, res) => {
                        resolve(channel);
                      });
                    }
                    else {
                      reject(`User: ${username} already member of channel: ${channel_name}`);
                    }
                  }
                });
              });
            }
          });
        });
      });
    });
  }

  /** Remoe a user from a channel
   * @param {*} username 
   * @param {*} group_name 
   * @param {*} channel_name 
   * @returns channel
   */
  module.remove_user_from_channel = function(username, group_name, channel_name) {
 
    return new Promise((resolve, reject) => {
      const channels = db.collection("channels");
      
      channels.findOne({name: channel_name, parent_group: group_name}, (err, channel) => {
        if (channel == null) {
          reject(`Cannot find channel: '${channel_name}' containing user: '${username}'`);
        }
        else {
          let index = channel.users.indexOf(username);
          if (index < 0) {
            reject(`User: ${username} not member of channel: ${channel_name}`);
          }
          else {
            channel.users.splice(index, 1);
            const update = {
              $set: {users: channel.users}
            };
            channels.updateOne({name: channel_name}, update, (err, res) => {
              resolve(channel);
            });
          }
        }
      });
    });
  }

  /** Set the system-wide permission level of a user
   * 
   * @param {*} username string
   * @param {*} role number (0-3)
   */
  module.set_role = function(username, role, group_name) {
    
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, user) => {
        if (err) reject(err);
        
        let update;

        // If being made group assistant/admin, add to permission_levels
        if (group_name != "") {
          user.permission_levels[group_name] = role;
          update = {
            $set: {
              permission_levels: user.permission_levels
            }
          };
        }

        // Else if being demoted to regular user, remove all permission_levels
        else if (role == 0) {
          update = {
            $set: {
              role: 0,
              permission_levels: {}
            }
          };
        }

        // Else if being made user/super admin, set system-wide role
        else {
          update = {
            $set: {
              role: role,
            }
          };
        }

        users.updateOne({username: username}, update, (err, res) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    });
  }

  module.update_peer_id = function(username, peer_id) {
    return new Promise((resolve, reject) => {
      const users = db.collection("users");
      users.findOne({username: username}, (err, usr) => {
        if (usr == null) {
          reject(`Cannot find user: ${username}`);
        }
        else {
          usr.peer_id = peer_id;
         users.updateOne({username: username}, {$set: {peer_id: peer_id}}, (err, res) => {
          resolve(usr);
         });
        }
      });
    });
  }

  return module;
}