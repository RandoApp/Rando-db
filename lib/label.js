var mongoose = require("mongoose");
var winston = require("winston");

var Label = mongoose.model("label", new mongoose.Schema({
  email: String,
  randoId: String,
  randoUrl: String,
  labels: [String],
  creation: Number
}));

module.exports = {
  save(label, callback) {
    winston.info("DB.Label: Add label");
    var randoId = label.randoId;
    Label.findOneAndUpdate({randoId}, label, {upsert: true}, function (err) {
      if (err) {
        winston.warn("DB.Label: Can't create label because: ", err);
      }
      if (callback) {
        winston.info("DB.Label: Saved label");
        callback(err);
      }
    });
  },
  getAllLightByLabel(label, callback) {
    winston.info("DB.Label: get all light labels");
    if (label) {
      Label.find({labels: label}, callback).lean();
    } else {
      Label.find({}, callback).lean();
    }
  },
  getByRandoId(randoId, callback) {
    winston.info("DB.Label: get all light labels");
    Label.findOne({randoId}, callback).lean();
  },
  //WARN!!! Use this method only for tests
  removeAll(callback) {
    winston.warn("DB.Label: DELETE ALL LABELS!");
    Label.remove({}, callback);
  }
};
