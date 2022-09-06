const fs = require('fs');

module.exports = {
  
  // number
  next_user_id: JSON.parse(fs.readFileSync(__dirname + "/next_user_id.json")),
  
  // Array of User
  users: JSON.parse(fs.readFileSync(__dirname + "/users.json")),
  
  // Array of Group
  groups: JSON.parse(fs.readFileSync(__dirname + "/groups.json")),
  
  
  // UTILITIES
  //-----------------------------------------

  save_groups_to_file: function() {
    fs.writeFileSync(__dirname + "/groups.json", JSON.stringify(this.groups, null, 2));
  },

  save_users_to_file: function() {
    fs.writeFileSync(__dirname + "/users.json", JSON.stringify(this.users, null, 2));
  },

  is_member: function(username, user_array) {
    for (let i=0; i<user_array.length; i++) {
      if (username == user_array[i]) {
        return true;
      }
    }
    return false;
  },

  //-----------------------------------------


  /** Adds a message to the messages array of a given channel
   * @param {Object} message message object
   * @param {string} group_name
   * @param {string} channel_name
   * @returns {null}
   */
  add_message_to_channel: function(message, group_name, channel_name) {
    this.groups.forEach((group) => {
      if (group.name == group_name)
      group.channels.forEach((channel) => {
        if (channel.name == channel_name) {
          channel.messages.unshift(message);
          let group_data = JSON.stringify(this.groups, null, 2);
          fs.writeFileSync(__dirname + "/groups.json", group_data);
        }
      })
    })
  },
  
  /**
   * @param {string} email 
   * @param {string} password 
   * @returns {User} User object
   */
  verify_user: function(email, password) {
    for (let i=0; i<this.users.length; i++)
      if (email == this.users[i].email && password == this.users[i].password)
        return this.users[i];
    return {email: "false"};
  },
  
  /**
   * @param {string} username 
   * @param {string} role 
   * @returns {Array<group>} Array of groups/channels the user is a member of
   */
  get_groups_of_user: function(username, role) {
    user_groups = [];
    if (role == 3) {
      user_groups = this.groups;
    }
    
    else if (role < 3) {
      // Get groups that user is a member of
      this.groups.forEach((group) => {
        group.users.forEach((user) => {
          if (username==user)
          user_groups.push(group);
        })
      });
      
      // Remove channels that user is not a member of
      user_groups.forEach((group) => {
        for (let i=0; i<group.channels.length; i++) {
          is_member = false;
          
          group.channels[i].users.forEach((user) => {
            if (user == username)
            is_member = true;
          });
          
          if (!is_member) {
            group.channels.splice(i, 1);
          }
        }
      });
      
    }
    return user_groups;
  },
  
  /**
   * @param {string} username
   * @returns {Array<User>} Array of users that are a member of the group
   */
  get_users_of_group: function(username) {
    let user_groups = [];
    
    this.groups.forEach((group) => {
      group.users.forEach((user) => {
        if (username==user)
        user_groups.push(group);
      })
    });
    
    return user_groups;
  },

  get_channels_of_group: function(group_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        return this.groups[i].channels;
      }
    }
  },

  get_group: function(group_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        return this.groups[i];
      }
    }
  },

  create_group: function() {

  },
  
  
  create_user: function(username, email, password) {
    const new_user = {
      id: this.next_user_id++,
      username: username,
      email: email,
      password: password,
      role: 0
    }
    this.users.unshift(new_user);
    this.save_users_to_file()    
    fs.writeFileSync(__dirname + "/next_user_id.json", JSON.stringify({next_user_id: this.next_user_id}));
  },
  
  delete_user: function() {

  },

  set_role: function() {

  },

  create_group: function(group_name)  {
    
    // Make sure group doesn't already exist.
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        return;
      }
    }

    // Add new group
    this.groups.push(
      {
        name: group_name,
        image: "image_1.jpg",
        users: [],
        channels: []
      }
    );
    this.save_groups_to_file();
  },

  delete_group: function(group_name) {
    console.log(`delete ${group_name}`);
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        this.groups.splice(i, 1);
        this.save_groups_to_file();
        return;
      }
    }
  },

  add_user_to_group: function(username, group_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        if (this.is_member(username, this.groups[i].users) == false) {
          this.groups[i].users.push(username);
          this.save_groups_to_file();
          return;
        }
      }
    }
  },

  remove_user_from_group: function() {
    
  },

  create_channel: function(channel_name, group_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {

        // Make sure channel doesn't exist yet
        for (let j=0; j<this.groups[i].channels.length; j++) {
          if (this.groups[i].channels[j].name == channel_name) {
            return;
          }
        }

        this.groups[i].channels.push(
          {
            name: channel_name,
            users: [],
            messages: []
          }
        )
      }
    }

    
    this.save_groups_to_file();
  },

  delete_channel: function(channel_name, group_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        for (let j=0; j<this.groups[i].channels.length; j++) {
          if (this.groups[i].channels[j].name == channel_name) {
            this.groups[i].channels.splice(j, 1);
            this.save_groups_to_file();
            return;
          }
        }
      }
    }
  },

  /**
   * 
   * @param {string} username 
   * @param {string} group_name 
   * @param {string} channel_name 
   */
  add_user_to_channel: function(username, group_name, channel_name) {
    for (let i=0; i<this.groups.length; i++) {

      if (this.groups[i].name == group_name) {
        this.add_user_to_group(username, group_name);

        for (let j=0; j<this.groups[i].channels.length; j++) {

          if (this.groups[i].channels[j].name == channel_name) {
            if (this.is_member(username, this.groups[i].channels[j].users) == false) {
              this.groups[i].channels[j].users.push(username);
              this.save_groups_to_file();
              return;
            }
          }
        }
      }
    }
  },

  remove_user_from_channel: function(username, group_name, channel_name) {
    for (let i=0; i<this.groups.length; i++) {
      if (this.groups[i].name == group_name) {
        for (let j=0; j<this.groups[i].channels.length; j++) {
          if (this.groups[i].channels[j].name == channel_name) {
            for (let k=0; k<this.groups[i].channels[j].users.length; k++) {
              if (this.groups[i].channels[j].users[k] == username) {
                this.groups[i].channels[j].users.splice(k, 1);
                this.save_groups_to_file();
              }
            }
          }
        }
      }
    }
  },
  
}