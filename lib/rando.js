var mongoose = require("mongoose");
var winston = require("winston");

var Rando = mongoose.model("rando", new mongoose.Schema({
    email: String,
    randoId: {type: String, unique: true},
    creation: Number,
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
}));

module.exports = {
  add (rando, callback) {
    winston.info("DB.Rando: Add rando by: ", rando.email);
    new Rando(rando).save(callback);
  },
  getByRandoId (randoId, callback) {
    winston.info("DB.Rando: get by randoId:", randoId);
    Rando.findOne({randoId}, callback);
  },
  getAll (callback) {
    winston.info("DB.Rando: get all");
    Rando.find({}, callback);
  },
  getFirstN (N, callback) {
    winston.info("DB.Rando: get first ", N);
    Rando.find({}).limit(N).exec(callback);
  },
  getFirstLightN (N, callback) {
    winston.info("DB.Rando: get first light", N);
    Rando.find({}).limit(N).lean().exec(callback);
  },
  remove (rando, callback) {
    winston.info("Db.Rando: Remove rando: ", rando.email, " randoId: ", rando.randoId);
    rando.remove(function (err) {
      if (err) {
        winston.warn("DB.Rando: Can't remove rando: " , rando.randoId, " because: ", err);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  removeById (randoId, callback) {
    winston.info("Db.Rando: Remove rando by id:", randoId);
    Rando.remove({randoId}, function (err) {
      if (err) {
        winston.warn("DB.Rando: Can't remove rando by id: ", randoId, " because: ", err);
      } else {
        winston.info("Db.Rando: Rando removed by id:", randoId);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  removeByRandoIds (randoIds, callback) {
    winston.info("Db.Rando: Remove rando by ids:", randoIds);
    Rando.remove({randoId: {"$in": randoIds}}, function (err) {
      if (err) {
        winston.warn("DB.Rando: Can't remove randos by ids: ", randoIds, " because: ", err);
      } else {
        winston.info("Db.Rando: Randos removed by ids:", randoIds);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  update (rando, callback) {
    winston.info("DB.Rando: Update rando: ", rando.email, " randoId: ", rando.randoId);
    rando.save(function (err) {
      if (err) {
        winston.warn("DB.Rando: Can't update rando: " , rando.randoId, " because: ", err);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  updateRandoProperties (randoId, properties, callback) {
    winston.info("DB.Rando: updateRandoProperties by randoId:", randoId, "set properties:", properties);
    Rando.update({randoId}, {$set: properties}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  }
}
