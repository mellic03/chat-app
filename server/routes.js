const fakeDB = require('./fakeDB/fakeDB');

module.exports = function(app) {


  app.post('/api/auth', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const pass = req.body.password;
    const user = fakeDB.verify_user(email, pass);
    res.send(user)
  });

  app.get('/api/:user/:role/groups', (req, res) => {
    const username = req.params.user;
    const role = req.params.role;
    const groups = fakeDB.get_groups_of_user(username, role);
    res.send(groups);
  });
  
  app.get('api/:group/users', (req, res) => {
    const group_name = req.params.group_name;
    const users = fakeDB.get_users_of_group();
    res.send(users);
  });

  app.get('/api/userids', (req, res) => {
    let user_userid_pairs = [];
    fakeDB.users.forEach(user => {
      user_userid_pairs.push({username: user.username, user_id: user.id});
    });
    res.send(user_userid_pairs);
  });

  app.get('/api/groups', (req, res) => {
    res.send(fakeDB.groups);
  });

  app.get('/api/groups/:group_name/channels/:channel_name', (req, res) => {
    // console.log(`Group: ${req.params.group_name}\nChannel: ${req.params.channel_name}`);
    fakeDB.groups.forEach(group => {
      if (group.name == req.params.group_name) {
        group.channels.forEach(channel => {
          if (channel.name == req.params.channel_name) {
            // console.log("channel found");
            res.send(channel);
          }
        });
      }
    });
  });
}