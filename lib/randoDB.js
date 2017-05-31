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
      var admin = mongoose.connection.db.admin();
      admin.serverStatus(function(err, info) {
      if (err) return cb(err);
      var version = info.version.split('.').map(function(n) { return parseInt(n, 10); });
      winston.info("Connection to mongodb established. Version: "+ version);
    });
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
