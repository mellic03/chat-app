module.exports = function(app, db) {
  require("./user_routes")(app, db);
  require("./group_routes")(app, db);
}