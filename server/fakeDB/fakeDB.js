const fs = require('fs');
let users = JSON.parse(fs.readFileSync(__dirname + "/users.json"));
let groups = JSON.parse(fs.readFileSync(__dirname + "/groups.json"));


function verify_user(email, password) {
  for (let i=0; i<users.length; i++)
    if (email == users[i].email && password == users[i].password)
      return users[i];
  return {valid: false};
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