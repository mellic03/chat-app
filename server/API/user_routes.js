const fakeDB = require('../fakeDB/fakeDB');

module.exports = function(app) {

  // User authorisation. Move this somewhere else later.
  app.post('/api/auth', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const pass = req.body.password;
    const user = fakeDB.verify_user(email, pass);
    res.send(user)
  });

  // Return an array of groups which “username” is a member of
  app.get("/api/users/:username/groups", (req, res) => {
    const username = req.params.username;

    // Get role of user, if role == 3, then user is super admin and has access to all groups.
    let role = 0;
    fakeDB.users.forEach(user => {
      if (user.username == username) {
        role = user.role;
      }
    });

    if (role == 3) {
      res.send(fakeDB.groups);
    }

    else {
      let groups_of_user = [];
      fakeDB.groups.forEach(group => {
        group.users.forEach(user => {
          if (user == username) {
            groups_of_user.push(group);
          }
        })
      });
      res.send(groups_of_user);
    }
  });

  // Return an array of all username-userid pairs as JavaScript objects
  app.get("/api/users/userids", (req, res) => {
    let user_userid_pairs = [];
    fakeDB.users.forEach(user => {
      user_userid_pairs.push({username: user.username, user_id: user.id});
    });
    res.send(user_userid_pairs);
  });

  // Return the user id of “username”
  app.get("/api/users/:username/userid", (req, res) => {
    const username = req.params.username;
    fakeDB.users.forEach(user => {
      if (user.username = username) {
        res.send(user.id);
      }
    });
  });

  // Return an array of all usernames
  app.get("/api/users/users", (req, res) => {
    res.send(fakeDB.users);
  });

  // Return the username belonging to "user_id"
  app.get("/api/userids/:user_id/username", (req, res) => {
    const user_id = req.params.user_id;
    fakeDB.users.forEach(user => {
      if (user.userid = user_id) {
        res.send(user.username);
      }
    });
  });

}