const fakeDB = require('../fakeDB/fakeDB');

module.exports = function(app, db) {
  const DB = require("../DB/mongodb")(db);

  // User authorisation. Move this somewhere else later.
  app.post('/api/auth', (req, res) => {
    // console.log(req.body);
    const email = req.body.email;
    const pass = req.body.password;
    DB.verify_user(email, pass).then((usr) => {
      res.send(usr);
    });
  });



  app.post("/api/update_profile_photo", (req, res) => {
    const username = req.body.username;
    const image = req.body.image;
    DB.update_profile_photo(username, image).catch((err) => {
      console.log(err);
    }).then((response) => {
      res.send(response);
    });
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
    DB.get_user(req.params.username).catch(() => {
      res.send({});
    }).then(usr => {
      res.send(usr);
    });
  });



  // Return an array of groups which “username” is a member of
  app.get("/api/users/:username/groups", (req, res) => {
    const username = req.params.username;
    
    DB.get_groups_of_user(username).then(groups => {
      DB.get_channels_of_user(username).then((channels) => {
        // console.log(channels);
        groups.forEach(group => {            
          group.channels = [];
          channels.forEach(channel => {
            if (channel.parent_group == group.name) {
              group.channels.push(channel);
            }
          });
        });
        res.send(groups);
      });
    });
  });
}