const fs = require('fs');
let users = JSON.parse(fs.readFileSync(__dirname + "/users.json"));
let groups = JSON.parse(fs.readFileSync(__dirname + "/groups.json"));

function add_message_to_group(message, group_name)
{
  groups.forEach((group) => {
    console.log(group_name);
    if (group.name == group_name)
    {
      // console.log(true);
      // group.messages.unshift(message);
      // let group_data = JSON.stringify(groups, null, 2);
      // fs.writeFileSync(__dirname + "/groups.json", group_data);
    }
  })
}

function verify_user(email, password) {
  for (let i=0; i<users.length; i++)
    if (email == users[i].email && password == users[i].password)
      return users[i];
  return {email: false};
}

function get_groups_of_user(username) {
  let user_groups = [];

  groups.forEach((group) => {
    group.users.forEach((user) => {
      if (username==user) user_groups.push(group);
    })
  });
  
  return user_groups;
}

function get_users_of_group(username) {
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
exports.add_message_to_group = add_message_to_group;