var mongoose = require("mongoose");
var async = require("async");
var winston = require("winston");

var User = mongoose.model("user", new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  authToken: String,
  facebookId: String,
  googleId: String,
  anonymousId: String,
  password: String,
  ban: Number,
  ip: String,
  firebaseInstanceIds: [{
    instanceId: String,
    active: Number,
    createdDate: Number,
    lastUsedDate: Number
  }],
  in: [{
    email: String,
    randoId: String,
    chosenRandoId: String,
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
    strangerMapURL: String,
    strangerMapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    rating: Number,
    tags: [String],
    delete: Number
  }],
  out: [{
    email: String,
    randoId: String,
    chosenRandoId: String,
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
    strangerMapURL: String,
    strangerMapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    rating: Number,
    tags: [String],
    delete: Number
  }]
}));

module.exports = {
  create: function (user, callback) {
    winston.info("DB.User: Create user: ", user.email);

    new User(user).save(function (err) {
      if (err) {
        winston.warn("DB.User: Can't create user with email: ", user.email, " because: ", err);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  update: function (user, callback) {
    winston.info("DB.User: Update user: ", user.email);

    user.save(function (err) {
      if (err) {
        winston.warn("DB.User: Can't update user with email: ", user.email, " because: ", err);
      }
      if (callback) {
        callback(err);
      }
    });
  },
  getByEmail: function (email, callback) {
    winston.info("DB.User: Get by email: ", email);
    User.findOne({email: email}, callback);
  },
  getById: function (id, callback) {
    winston.info("DB.User: Get by id: ", id);
    User.findById(id, callback);
  },
  getByToken: function (token, callback) {
    winston.info("DB.User: Get by token: ", token);
    User.findOne({authToken: token}, callback);
  },
  getLightRandoByRandoId (randoId, callback) {
    winston.info("DB.User: Get rando by randoId: ", randoId);
    User.findOne({"out.randoId": randoId}, {"out.$": 1}, callback).lean();
  },
  getLightUserByToken (token, callback) {
    winston.info("DB.User: getLightUserByToken:", token);
    User.findOne({authToken: token}, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      firebaseInstanceIds: 1
    }, callback).lean();
  },
  getLightUserByEmail (email, callback) {
    winston.info("DB.User: getLightUserByEmail:", email);
    User.findOne({email}, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      firebaseInstanceIds: 1
    }, callback).lean();
  },
  updateUserMetaByEmail (email, meta, callback) {
    winston.info("DB.User: updateUserMetaByEmail:", email);
    User.update({email}, meta, function (err) {
      if (callback) {
        return callback(err);
      }
    });
  },
  updateActiveForAllFirabaseIdsByEmail (email, value, callback) {
    winston.info("DB.User: updateActiveForAllFirabaseIdsByEmail by email: ", email);
    User.update({email}, {"$set": {
    "items.$.active":  value
    }}, function (err) {
      if (callback) {
        return callback(err);
      }
    });
  },
  updateDeleteFlagForOutRando (email, randoId, deleteFlag, callback) {
    winston.info("DB.User: updateDeleteFlagForOutRando by email:", email, "and randoId:", randoId);
    User.update({$and: [{email}, {"out.randoId": randoId}]}, {$set: {
      "out.$.delete": deleteFlag
    }}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateDeleteFlagForInRando (email, randoId, deleteFlag, callback) {
    winston.info("DB.User: updateDeleteFlagForInRando by email:", email, "and randoId:", randoId);
    User.update({$and: [{email}, {"in.randoId": randoId}]}, {$set: {
      "in.$.delete": deleteFlag
    }}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateOutRandoProperties (email, randoId, properties, callback) {
    for (var property in properties) {
      properties["out.$." + property] = properties[property];
      delete properties[property];
    }

    winston.info("DB.User: updateOutRandoProperties by email:", email, "and randoId:", randoId, "set properties:", properties);
    User.update({$and: [{email}, {"out.randoId": randoId}]}, {$set: properties}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateChosenRandoIdForOutRando (email, randoId, chosenRandoId, callback) {
    winston.info("DB.User: updateChosenRandoIdForOutRando by email:", email, "and randoId:", randoId);
    User.update({$and: [{email}, {"out.randoId": randoId}]}, {$set: {
      "out.$.chosenRandoId": chosenRandoId
    }}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  getAllLightOutRandosByEmail (email, limit, callback) {
    winston.info("DB.User: getLastOutRandosByEmail by email:", email);
    User.findOne({email}, {
      "out.randoId": 1,
      "out.creation": 1,
    }, callback).lean();
  },
  getAllLightInAndOutRandosByEmail (email, callback) {
    winston.info("DB.User: getAllLightInAndOutRandosByEmail by email:", email);
    User.findOne({email}, {
      "out.randoId": 1,
      "out.creation": 1,
      "out.imageURL": 1,
      "out.imageSizeURL": 1,
      "out.strangerMapURL": 1,
      "out.strangerMapSizeURL": 1,
      "out.delete": 1,
      "out.tags": 1,
      "in.randoId": 1,
      "in.creation": 1,
      "in.imageURL": 1,
      "in.imageSizeURL": 1,
      "in.mapURL": 1,
      "in.mapSizeURL": 1,
      "in.delete": 1
    }, callback).lean();
  },
  addRandoToUserOutByEmail (email, rando, callback) {
    winston.info("DB.User: addRandoToUserOutByEmail by email:", email);
    User.findOneAndUpdate({email}, {$push: {"out": rando}}, {
      safe: true
    }, function(err) {
      if (callback) {
        callback(err);
      }
    });
  },
  addRandoToUserInByEmail (email, rando, callback) {
    winston.info("DB.User: addRandoToUserOutByEmail by email:", email);
    User.findOneAndUpdate({email}, {$push: {"out": rando}}, {
      safe: true
    }, function(err) {
      if (callback) {
        callback(err);
      }
    });
  },
  getLightOutRandosForPeriod (start, end, callback) {user.
    winston.info("DB.User: getLightOutRandosForPeriod for period:", start, "-", end);

    User.mapReduce({
      map: function () {
        for (var i = 0; i < this.out.length; i++) {
          if (this.out[i].creation >= start && this.out[i].creation <= end) {
            emit(this.out[i].email, this.out[i]);
          }
        }
      },
      reduce: function (k, vals) {
        var randos = [];
        vals.forEach(rando => {
          randos.push(rando);
        });
        return {email: k, randos};
      },
      out: {inline: 1},
      scope: {
        start,
        end
      }
    }, (err, res) => {
      if (err) {
        return callback(err);
      }

      var randos = [];
      res.forEach((userWithOut) => {
        if (userWithOut.value.randos && userWithOut.value.randos.length > 0) {
          randos = randos.concat(userWithOut.value.randos);
        } else {
          randos.push(userWithOut.value);
        }
      });

      return callback(null, randos);
    });
  },
  getAll: function (callback) {
    winston.info("DB.User: get all users");
    User.find({}, callback);
  },
  mapReduce: function (map, reduce, result) {
    winston.info("DB.User: mapReduce");
    User.mapReduce({map: map, reduce: reduce}, result);
  },
  getEmailsAndRandosNumberArray: function (callback) {
    winston.info("DB.User: mapReduce: get emails and randos");
    User.mapReduce({
      map: function () {
        emit(this.email, this.randos.length);
      },
      reduce: function (k, vals) {
        return vals;
      }
    }, function (err, emails) {
      async.each(emails, function (email, done) {
        email.email = email["_id"];
        email.randos = email.value;
        delete email["_id"];
        delete email.value;
        done();
      }, function (err) {
        callback(err, emails);
      });
    });
  }
};
