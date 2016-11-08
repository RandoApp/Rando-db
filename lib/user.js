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
    'items.$.active':  value
    }}, function (err) {
      if (callback) {
        return callback(err);
      }
    });
  },
  updateDeleteFlagForOutRando (email, randoId, deleteFlag, callback) {
    winston.info("DB.User: updateDeleteFlagForOutRando by email:", email, "and randoId:", randoId);
    User.update({"$and": [{email}, {"out.randoId": randoId}]}, {"$set": {
      "out.$.delete": deleteFlag
    }}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateDeleteFlagForInRando (email, randoId, deleteFlag, callback) {
    winston.info("DB.User: updateDeleteFlagForInRando by email:", email, "and randoId:", randoId);
    User.update({"$and": [{email}, {"in.randoId": randoId}]}, {"$set": {
      "in.$.delete": deleteFlag
    }}, function (err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  getLastLightOutRandosByEmail (email, limit, callback) {
    winston.info("DB.User: getLastOutRandosByEmail by email:", email);
    User
    .find({"out.email": email}, {"out.$": 1})
    .sort({'creation': -1})
    .limit(limit)
    .lean()
    .exec(function(err, randos) {
      if (callback) {
        callback(err, randos);
      }
    });
  },
  addRandoToUserOutByEmail (email, rando, callback) {
    winston.info("DB.User: addRandoToUserOutByEmail by email:", email);
    User.findAndUpdate({email}, {$push: {"out": {rando}}}, {safe: true, upsert: true, new : true}, function(err) {
      if (callback) {
        callback(err);
      }
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
