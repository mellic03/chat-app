const fakeDB = require('../fakeDB/fakeDB');

module.exports = function(app, MongoClient) {
  const DB = require("../DB/mongodb")(MongoClient);

  // Return an array of all groups
  app.get("/api/groups", (req, res) => {
    res.send(fakeDB.groups);
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
      console.log(response);
      res.send(response);
    });
  });

  // Return the channel “channel_name” from the group “group_name"
  app.get("/api/groups/:group_name/channels/:channel_name", (req, res) => {
    const group_name = req.params.group_name;
    const channel_name = req.params.channel_name;
    // fakeDB.groups.forEach(group => {
    //   if (group.name == group_name) {
    //     group.channels.forEach(channel => {
    //       if (channel.name == channel_name) {
    //         res.send(channel);
    //       }
    //     });
    //   }
    // });
  });

}