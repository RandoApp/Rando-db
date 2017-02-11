var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");
var anomaly = require("./anomaly");
var exchangeLog = require("./exchangeLog");

module.exports = {
  connect: function (mongoURL, callback) {
    mongoose.connect(mongoURL);
    var db = mongoose.connection;

    db.on("error", function (e) {
      winston.error("Monodb connection error: " + e);
      if (callback) {
        callback(e);
      }
    });

    db.on("open", function () {
      winston.info("Connection to mongodb established");
      callback();
    });
    return db;
  },
  disconnect: function () {
    mongoose.disconnect();
    winston.info("Connections to mongodb closed");
  },
  user,
  rando,
  anomaly,
  exchangeLog
};
