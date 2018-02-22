var mongoose = require("mongoose");
var winston = require("winston");

var ExchangeLog = mongoose.model("exchangeLog", new mongoose.Schema({
  chooserId: String,
  choosers: [{
    email: String,
    randoId: String,
    creation: Number
  }],
  randos: [{
    email: String,
    randoId: String,
    chosenRandoId: String,
    creation: Number
  }],
  metrics: [{
    metrica: String,
    randoId: String,
    mark: String
  }],
  choosenId: String,
  exchangedAt: Number
}));

module.exports = {
  add (exchangeLog, callback) {
    winston.info("DB.ExchangeLog: Add exchangeLog");
    new ExchangeLog(exchangeLog).save(function (err) {
      if (err) {
        winston.warn("DB.ExchangeLog: Can't create exchangeLog because: ", err);
      }

      if (callback) {
        winston.info("DB.ExchangeLog: Added exchangeLog");
        callback(err);
      }
    });
  },
  getAllLights (callback) {
    winston.info("DB.ExchangeLog: get all exchangeLogs light");
    ExchangeLog.find({}, callback).lean();
  },
  getLastNLightLogs (limit, callback) {
    winston.info("DB.ExchangeLog: get last N exchangeLogs light");
    ExchangeLog.find({}).sort("exchangedAt").limit(limit).lean().exec(callback);
  }
};
