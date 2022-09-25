module.exports = function(app, MongoClient) {
  require("./user_routes")(app, MongoClient);
  require("./group_routes")(app, MongoClient);
}