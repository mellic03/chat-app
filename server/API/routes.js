module.exports = function(app) {
  require("./user_routes")(app);
  require("./group_routes")(app);
}