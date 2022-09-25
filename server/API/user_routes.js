const fakeDB = require('../fakeDB/fakeDB');

module.exports = function(app, db) {
  const DB = require("../DB/mongodb")(db);

  // User authorisation. Move this somewhere else later.
  app.post('/api/auth', (req, res) => {
    // console.log(req.body);
    const email = req.body.email;
    const pass = req.body.password;
    const user = fakeDB.verify_user(email, pass);
    res.send(user)
  });


  // Return an array of all usernames
  app.get("/api/users", (req, res) => {
    const users = db.collection("users");
    users.find({}).toArray((err, arr) => {
      res.send(arr);
    });
  });

  // Return user information of a given user
  app.get("/api/users/:username", (req, res) => {
    fakeDB.users.forEach(user => {
      if (user.username == req.params.username) {
        res.send(user);
      }
    });
  });


  // Return an array of groups which “username” is a member of
  app.get("/api/users/:username/groups", (req, res) => {
    const username = req.params.username;

    DB.get_groups_of_user(username).then(groups => {
      DB.get_channels_of_user(username).then(channels => {

        for (let i=0; i<groups.length; i++) { // For each group
          for (let j=0; j<channels.length; j++) { // For each channel
            for (let k=0; k<groups[i].channels.length; k++) { // For each channel name in group
              if (channels[j].name == groups[i].channels[k]) {
                groups[i].channels.push(channels[j]);
              }
            }
          }
          // remove strings from channels array
          for (let j=0; j<groups[i].channels.length; j++) {
            if (typeof(groups[i].channels[j]) == "string") {
              groups[i].channels.splice(j, 1);
              j--;
            }
          }
        }

          // console.log(groups[i].channels);
        
        res.send(groups);
      });
    }).catch(err => console.log(err));
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