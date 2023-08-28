module.exports = function(app, MongoClient) {
  const DB = require("../DB/mongodb")(MongoClient);

  // Update a group photo
  app.post("/api/groups/:group_name/update_photo", (req, res) => {
    const group_name = req.params.group_name;
    const image = req.body.photo;
    DB.update_group_photo(group_name, image).then((response) => {
      res.send(true);
    });
  });

  // Return an array of all group names.
  app.get("/api/groups/group_names", (req, res) => {
    DB.get_group_names().then(groups => {
      res.send(groups);
    });
  });

  // Return an array of users who are a member of “group_name”
  app.get("/api/groups/:group_name/users", (req, res) => {
    const group_name = req.params.group_name;
    DB.get_users_of_group(group_name).catch((err) => {
      console.log(err);
    }).then((users) => {
      res.send(users);
    });
  });

  // Return the group with name "group_name"
  app.get("/api/groups/:group_name", (req, res) => {
    const group_name = req.params.group_name;
    DB.get_group(group_name).then((group) => {
      res.send(group);
    });
  });

  // Return an array of channels in “group_name”
  app.get("/api/groups/:group_name/channels", (req, res) => {
    const group_name = req.params.group_name;
    DB.get_channels_of_group(group_name).then(response => {
      res.send(response);
    });
  });
}