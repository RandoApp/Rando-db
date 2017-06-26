var mongoose = require("mongoose");
var winston = require("winston");
var shell = require("shelljs");
var user = require("./user");
var rando = require("./rando");
var anomaly = require("./anomaly");
var exchangeLog = require("./exchangeLog");

module.exports = {
  connect (mongoURL, callback) {
    mongoose.connect(mongoURL, null, err => {
      if (err) {
        winston.error("Monodb connection error: " + err);
      }
      if (callback) {
        callback(err);
      }
    });
  },
  disconnect (callback) {
    mongoose.disconnect(() => {
      winston.info("Connections to mongodb closed");
      if (callback) {
        callback();
      }
    });
  },
  status (callback) {
    var status = shell.exec('mongo --quiet -eval "printjson(db.serverStatus())"', {silent: true}, (code, stdout, stderr) => {
      winston.info("DB status code: " + code);
      if (callback) {
        if (code === 0 && !stderr) {
          return callback(null, stdout);
        } else {
          return callback(new Error("db.status fail. Code: " + code));
        }
      }
    });
  },
  user,
  rando,
  anomaly,
  exchangeLog
};
