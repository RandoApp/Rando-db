var mongoose = require('mongoose');
var winston = require('winston');

var Label = mongoose.model('label', new mongoose.Schema({
  email: String,
  randoId: String,
  randoUrl: String,
  labels: [String],
  creation: Number
}));

module.exports = {
  save(label, callback) {
    winston.info('DB.Label: Save label');
    var randoId = label.randoId;
    Label.findOneAndUpdate({randoId}, label, {upsert: true}, (err) => {
      if (err) {
        winston.warn('DB.Label: Cannot create label because: ', err);
      }
      if (callback) {
        winston.info('DB.Label: Saved label');
        callback(err);
      }
    });
  },
  getAllLightByLabel(label, callback) {
    winston.info('DB.Label: get all light labels');
    if (label) {
      Label.find({labels: label}, callback).lean();
    } else {
      Label.find({}, callback).lean();
    }
  },
  getAllLight(offset, limit, callback) {
    winston.info('DB.Label: get all light with offset: ' + offset + ' and limit: ' + limit);
      Label.find({})
      .sort({_id: 1})
      .select({email: 1, randoId: 1, randoUrl: 1, labels: 1, creation: 1})
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean()
      .exec(callback);
  },
  getByRandoId(randoId, callback) {
    winston.info('DB.Label: get label by randoId');
    Label.findOne({randoId}, callback).lean();
  },
  //WARN!!! Use this method only for tests
  removeAll(callback) {
    winston.warn('DB.Label: DELETE ALL LABELS!');
    Label.remove({}, callback);
  }
};
