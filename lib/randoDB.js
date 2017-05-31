var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");
var anomaly = require("./anomaly");
var exchangeLog = require("./exchangeLog");

module.exports = {
  connect (mongoURL, callback) {
    mongoose.connect(mongoURL, null, callback);
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
