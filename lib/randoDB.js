var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");
var anomaly = require("./anomaly");

module.exports = {
  connect: function (mongoURL) {
    mongoose.connect(mongoURL);
    var db = mongoose.connection;

    db.on("error", function (e) {
      winston.error("Monodb connection error: " + e);
    });

    db.on("open", function () {
      winston.info("Connection to mongodb established");
    });
    return db;
  },
  disconnect: function () {
    mongoose.disconnect();
    winston.info("Connections to mongodb closed");
  },
  user,
  rando,
  anomaly
};
