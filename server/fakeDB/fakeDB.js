const fs = require('fs');

// number
let next_user_id = JSON.parse(fs.readFileSync(__dirname + "/next_user_id.json"));

// Array of User
let users = JSON.parse(fs.readFileSync(__dirname + "/users.json"));

// Array of Group
let groups = JSON.parse(fs.readFileSync(__dirname + "/groups.json"));


/** Adds a message to the messages array of a given channel
 * @param {string} message
 * @param {string} group_name
 * @param {string} channel_name
 * @returns {null}
 */
function add_message_to_channel(message, group_name, channel_name) {
  groups.forEach((group) => {
    if (group.name == group_name)
      group.channels.forEach((channel) => {
        if (channel.name == channel_name) {
          channel.messages.unshift(message);
          let group_data = JSON.stringify(groups, null, 2);
          fs.writeFileSync(__dirname + "/groups.json", group_data);
        }
      })
  })
}

/**
 * @param {string} email 
 * @param {string} password 
 * @returns {User} User object
 */
function verify_user(email, password) {
  for (let i=0; i<users.length; i++)
    if (email == users[i].email && password == users[i].password)
      return users[i];
  return {email: false};
}

/**
 * @param {string} username 
 * @param {string} role 
 * @returns {Array<group>} Array of groups/channels the user is a member of
 */
function get_groups_of_user(username, role) {
  user_groups = [];
  if (role == "superadmin") {
    user_groups = groups;
  }

  else if (role == "user") {
    // Get groups that user is a member of
    groups.forEach((group) => {
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
}

/**
 * @param {string} username
 * @returns {Array<User>} Array of users that are a member of the group
 */
function get_users_of_group(username) {
  let user_groups = [];

  groups.forEach((group) => {
    group.users.forEach((user) => {
      if (username==user)
        user_groups.push(group);
    })
  });
  
  return user_groups;
}


function create_user(username, email, password) {
  const new_user = {
    id: next_user_id,
    username: username,
    email: email,
    password: password,
    role: "user"
  }
  users.unshift(new_user);
  fs.writeFileSync(__dirname + "/users.json", JSON.stringify(users));

  fs.writeFileSync(__dirname + "/next_user_id.json", JSON.stringify({next_user_id: next_user_id++}));
}

function create_channel(group_name) {
  groups.push(
    {
      name: group_name,
      image: "image_1.jpg",
      users: [],
      channels: []
    }
  )
  fs.writeFileSync(__dirname + "/groups.json", group_data);
}

exports.get_groups_of_user = get_groups_of_user;
exports.verify_user = verify_user;
exports.get_users_of_group = get_users_of_group;
exports.add_message_to_group = add_message_to_channel;
exports.create_user = create_user;
exports.create_channel = create_channel;