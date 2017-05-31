var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");
var anomaly = require("./anomaly");
var exchangeLog = require("./exchangeLog");

module.exports = {
  connect (mongoURL, callback) {
    mongoose.connect(mongoURL);
    var db = mongoose.connection;

    db.on("error", e => {
      winston.error("Monodb connection error: " + e);
      if (callback) {
        callback(e);
      }
    });

    db.on("open", e => {
      winston.info("Connection to mongodb established.");
      if (callback) {
        callback(e);
      }
    });
    return db;
  },
  disconnect (callback) {
    mongoose.disconnect();
    winston.info("Connections to mongodb closed");
    if (callback) {
      callback();
    }
  },
  user,
  rando,
  anomaly,
  exchangeLog
};
