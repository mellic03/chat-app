const fs = require('fs');

module.exports = {
  
  // number
  next_user_id: JSON.parse(fs.readFileSync(__dirname + "/next_user_id.json")),
  
  // Array of User
  users: JSON.parse(fs.readFileSync(__dirname + "/users.json")),
  
  // Array of Group
  groups: JSON.parse(fs.readFileSync(__dirname + "/groups.json")),
  
  
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
    return {email: false};
  },
  
  /**
   * @param {string} username 
   * @param {string} role 
   * @returns {Array<group>} Array of groups/channels the user is a member of
   */
  get_groups_of_user: function(username, role) {
    user_groups = [];
    if (role == "superadmin") {
      user_groups = this.groups;
    }
    
    else if (role == "user") {
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
  
  
  create_user: function(username, email, password) {
    const new_user = {
      id: this.next_user_id++,
      username: username,
      email: email,
      password: password,
      role: "user"
    }
    this.users.unshift(new_user);
    fs.writeFileSync(__dirname + "/users.json", JSON.stringify(users));
    
    fs.writeFileSync(__dirname + "/next_user_id.json", JSON.stringify({next_user_id: this.next_user_id}));
  },
  
  create_channel: function(group_name) {
    this.groups.push(
      {
        name: group_name,
        image: "image_1.jpg",
        users: [],
        channels: []
      }
      )
      fs.writeFileSync(__dirname + "/groups.json", group_data);
    }
    
}