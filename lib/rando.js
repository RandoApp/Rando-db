var mongoose = require("mongoose");
var winston = require("winston");

var Rando = mongoose.model("rando", new mongoose.Schema({
    email: String,
    randoId: {type: String, unique: true},
    strangerRandoId: String,
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
    rating: Number,
    delete: Number
}));

module.exports = {
    add: function (rando, callback) {
      winston.info("DB.Rando: Add rando by: ", rando.email);
      new Rando(rando).save(callback);
    },
    getByRandoId: function (randoId, callback) {
      winston.info("DB.Rando: get by randoId:", randoId);
      Rando.findOne({randoId: randoId}, callback);
    },
    getAll: function (callback) {
      winston.info("DB.Rando: get all");
      Rando.find({}, callback);
    },
    getFirstN: function (N, callback) {
      winston.info("DB.Rando: get first ", N);
      Rando.find({}).limit(N).exec(callback);
    },
    remove: function (rando, callback) {
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
    removeById: function (randoId, callback) {
      var self = this;
      this.getByRandoId(randoId, function (err, rando) {
        if (err) {
          winston.warn("DB.Rando: Can't find rando with id: ", randoId, "for deleting, because:", err);
          callback(err);
          return;
        }

        self.remove(rando, callback);
      });
    },
    update: function (rando, callback) {
      winston.info("DB.Rando: Update rando: ", rando.email, " randoId: ", rando.randoId);
      rando.save(function (err) {
        if (err) {
          winston.warn("DB.Rando: Can't update rando: " , rando.randoId, " because: ", err);
        }

        if (callback) {
          callback(err);
        }
      });
    }
}
