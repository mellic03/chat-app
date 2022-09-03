const fs = require('fs');
let users = JSON.parse(fs.readFileSync(__dirname + "/users.json"));
let groups = JSON.parse(fs.readFileSync(__dirname + "/groups.json"));

/** Adds a message to the messages array of a given channel
 * @param {string} message
 * @param {string} group_name
 * @param {string} channel_name
 * @returns {null}
 */
function add_message_to_channel(message, group_name, channel_name)
{
  groups.forEach((group) =>
  {
    if (group.name == group_name)
      group.channels.forEach((channel) =>
      {
        if (channel.name == channel_name)
        {
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
function verify_user(email, password)
{
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
function get_groups_of_user(username, role)
{
  user_groups = [];
  console.log(role);
  if (role == "superadmin")
    user_groups = groups;
  else if (role == "user")
  {
    // Get groups that user is a member of
    groups.forEach((group) => {
      group.users.forEach((user) => {
        if (username==user)
          user_groups.push(group);
      })
    });

    // Remove channels that user is not a member of
    user_groups.forEach((group) => {
      for (let i=0; i<group.channels.length; i++)
      {
        is_member = false;
        
        group.channels[i].users.forEach((user) => {
          if (user == username)
            is_member = true;
        });

        if (!is_member)
        {
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
function get_users_of_group(username)
{
  let user_groups = [];

  groups.forEach((group) => {
    group.users.forEach((user) => {
      if (username==user) user_groups.push(group);
    })
  });
  
  return user_groups;
}

exports.get_groups_of_user = get_groups_of_user;
exports.verify_user = verify_user;
exports.get_users_of_group = get_users_of_group;
exports.add_message_to_group = add_message_to_channel;