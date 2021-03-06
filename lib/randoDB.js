const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");
const shell = require("shelljs");
const user = require("./user");
const rando = require("./rando");
const anomaly = require("./anomaly");
const exchangeLog = require("./exchangeLog");
const label = require("./label");

mongoose.Promise = global.Promise;

module.exports = {
  connect(mongoURL, callback) {
    winston.log("Connection to mongo");
    mongoose.connect(mongoURL, {
      socketTimeoutMS: config.db.socketTimeoutMS,
      keepAlive: config.db.keepAlive,
      reconnectTries: config.db.reconnectTries
     }).then(db => {
      winston.info("Connected to mongodb using url:", mongoURL);
      if (callback) {
        return callback(null);
      }
    }).catch(err => {
      winston.error("Monodb connection error: ", err);
      if (callback) {
        return callback(err);
      }
    });
  },
  disconnect(callback) {
    winston.info("Disconnecting");
    mongoose.connection.close((err) => {
      winston.info("Connection closed");
      if (callback) {
        return callback(err);
      }
    });
  },
  status(callback) {
    var status = shell.exec("mongo --quiet -eval \"printjson(db.serverStatus())\"", {
      silent: true
    }, (code, stdout, stderr) => {
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
  exchangeLog,
  label
};
