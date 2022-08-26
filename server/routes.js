const fakeDB = require('./fakeDB/fakeDB');

module.exports = function(app){

  app.post('/api/auth', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const pass = req.body.password;
    const user = fakeDB.verify_user(email, pass);
    res.send(user)
  });

  app.get('/api/:user/groups', (req, res) => {
    const username = req.params.user;
    const groups = fakeDB.get_groups_of_user(username);
    res.send(groups);
  });

  app.get('api/:group/users', (req, res) => {
    const group_name = req.params.group_name;
    const users = fakeDB.get_users_of_group;
    res.send(users);
  })
  
}