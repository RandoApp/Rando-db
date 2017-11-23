var mongoose = require("mongoose");
var winston = require("winston");

var Anomaly = mongoose.model("anomaly", new mongoose.Schema({
  rando: {
    email: String,
    randoId: {type: String},
    creation: Number,
    exchangedDate: Number,
    ip: String,
    location: {
      latitude: Number,
      longitude: Number
    },
    imageURL: String,
    imageSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    mapURL: String,
    mapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    chosenRandoId: String,
    strangerRandoId: String,
    strangerMapURL: String,
    strangerMapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    rating: Number,
    tags: [String],
    delete: Number
  },
  discrepancyReason: String,
  detectedAt: Number
}));

module.exports = {
  add (anomaly, callback) {
    winston.info("DB.Anomaly: Add anomaly");
    new Anomaly(anomaly).save(function (err) {
      if (err) {
        winston.warn("DB.Anomaly: Can't create anomaly because: ", err);
      }

      if (callback) {
        winston.info("DB.Anomaly: Added Anomaly");
        callback(err);
      }
    });
  },
  getAll (callback) {
    winston.info("DB.Anomaly: get all");
    Anomaly.find({}, callback).lean();
  },
  getByRandoId (randoId, callback) {
    winston.info("DB.Anomaly: Get anomaly by randoId:", randoId);
    Anomaly.findOne({"rando.randoId": randoId}, function (err, anomaly) {
      if (err) {
        winston.warn("DB.Anomaly: Can't find anomaly by randoId: ", randoId, " because: ", err);
      }

      if (callback) {
        callback(err, anomaly);
      }
    }).lean();
  },
  removeByRandoId (randoId, callback) {
    winston.info("DB.Anomaly: Remove anomaly by randoId:", randoId);
    Anomaly.remove({"rando.randoId": randoId}, function (err) {
      if (err) {
        winston.warn("DB.Anomaly: Can't remove anomaly by randoId: ", randoId, " because: ", err);
      } else {
        winston.info("DB.Anomaly: Anomyly removed by randoId:", randoId);
      }

      if (callback) {
        callback(err);
      }
    });
  }
};
