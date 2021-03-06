var mongoose = require("mongoose");
var async = require("async");
var winston = require("winston");

var User = mongoose.model("user", new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
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
  report: [{
    reportedBy: String,
    reason: String,
    reportedDate: Number,
    randoId: String
  }],
  in: [{
    email: String,
    randoId: String,
    originalFileName: String,
    chosenRandoId: String,
    strangerRandoId: String,
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
    strangerMapURL: String,
    strangerMapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    tags: [String],
    delete: Number,
    report: Number,
    rating: Number
  }],
  out: [{
    email: String,
    randoId: String,
    originalFileName: String,
    chosenRandoId: String,
    strangerRandoId: String,
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
    strangerMapURL: String,
    strangerMapSizeURL: {
      small: String,
      medium: String,
      large: String
    },
    tags: [String],
    delete: Number,
    report: Number,
    rating: Number
  }]
}));

module.exports = {
  getLightRandoByRandoId(randoId, callback) {
    winston.info("DB.User: Get rando by randoId: ", randoId);
    User.findOne({ "out.randoId": randoId }, { "out.$": 1 }, callback).lean();
  },
  getLightOutRandoByOrigianlFileName(email, originalFileName, callback) {
    winston.info("DB.User: Get rando by originalFileName:", originalFileName);
    User.findOne({ $and: [{ email }, { "out.originalFileName": originalFileName }] }, { "out.$": 1 }, callback).lean();
  },
  getLightUserByToken(token, callback) {
    winston.info("DB.User: getLightUserByToken:", token);
    User.findOne({ authToken: token }, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      firebaseInstanceIds: 1
    }, callback).lean();
  },
  getLightUserByEmail(email, callback) {
    winston.info("DB.User: getLightUserByEmail:", email);
    User.findOne({ email }, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      googleId: 1,
      anonymousId: 1,
      password: 1,
      firebaseInstanceIds: 1
    }, callback).lean();
  },
  //Used in exchanger project
  getLightUserWithInAndOutByEmail(email, callback) {
    winston.info("DB.User: getLightUserWithInAndOutByEmail:", email);
    User.findOne({ email }, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      firebaseInstanceIds: 1,
      "out.randoId": 1,
      "out.email": 1,
      "out.creation": 1,
      "out.exchangedDate": 1,
      "out.imageURL": 1,
      "out.imageSizeURL": 1,
      "out.strangerMapURL": 1,
      "out.strangerMapSizeURL": 1,
      "out.delete": 1,
      "out.report": 1,
      "out.tags": 1,
      "out.rating": 1,
      "in.randoId": 1,
      "in.email": 1,
      "in.creation": 1,
      "in.exchangedDate": 1,
      "in.imageURL": 1,
      "in.imageSizeURL": 1,
      "in.mapURL": 1,
      "in.mapSizeURL": 1,
      "in.delete": 1,
      "in.report": 1,
      "in.rating": 1
    }, callback).lean();
  },
  getAllLightOutRandosByEmail(email, limit, callback) {
    winston.info("DB.User: getLastOutRandosByEmail by email:", email);
    User.findOne({ email }, {
      "out.randoId": 1,
      "out.creation": 1,
      "out.exchangedDate": 1,
    }, callback).lean();
  },
  getAllLightInAndOutRandosByEmail(email, callback) {
    winston.info("DB.User: getAllLightInAndOutRandosByEmail by email:", email);
    User.findOne({ email }, {
      "out.randoId": 1,
      "out.creation": 1,
      "out.exchangedDate": 1,
      "out.imageURL": 1,
      "out.imageSizeURL": 1,
      "out.strangerMapURL": 1,
      "out.strangerMapSizeURL": 1,
      "out.delete": 1,
      "out.report": 1,
      "out.tags": 1,
      "out.rating": 1,
      "in.randoId": 1,
      "in.creation": 1,
      "in.exchangedDate": 1,
      "in.imageURL": 1,
      "in.imageSizeURL": 1,
      "in.mapURL": 1,
      "in.mapSizeURL": 1,
      "in.delete": 1,
      "in.report": 1,
      "in.rating": 1
    }, callback).lean();
  },
  getLightUserMetaByOutRandoId(randoId, callback) {
    winston.info("DB.User: Get rando by randoId:", randoId);
    User.findOne({ "out.randoId": randoId }, {
      email: 1,
      authToken: 1,
      ip: 1,
      ban: 1,
      report: 1,
      firebaseInstanceIds: 1
    }, callback).lean();
  },
  getBannedUsers (banStart, banEnd, offset, limit, callback) {
    winston.info("DB.User: Get banned users with banStart:", banStart, "banEnd:", banEnd, "offset:", offset, "limit:", limit);
    if (!offset && !limit) {
      if (callback) {
        return callback(null, []);
      }
    }

    User.find().where("ban").gte(banStart).lte(banEnd).sort("email").skip(offset).limit(limit).select("email ban report ip authToken").lean().exec(callback);
  },
  getUserStatistics(email, callback) {
    winston.info("DB.User: Get User statistics by user email:", email);
    User.aggregate()
      .match({email})
      .project({ "email" : 1 , "out" : 1 })
      .unwind("$out")
      .group({
                  _id: "$out.rating",
                  count: { $sum: 1 }
            })
      .match({"_id": {"$gte": 0}})
      .project({
                 
                 count: 1,
                 _id:
                   {
                     $cond: { if: { $gte: [ "$_id", 2 ] }, then: "likes", else: "dislikes" }
                   }
                }
              )
      . group({
                _id: "$_id",
                count: { $sum: "$count" }
              })
      .exec((err, result) => {
      if (err) {
        if (callback) {
          callback(err);
        }
      } else {
        var stats = {"likes": 0, "dislikes": 0};
        for (i = 0; i < result.length; i++) {
          stats[result[i]["_id"]] = result[i]["count"];
        }
        if (callback) {
          callback(err, stats);
        }
      }});
  },
  create: function(user, callback) {
    winston.info("DB.User: Create user: ", user.email);

    new User(user).save((err) => {
      if (err) {
        winston.warn("DB.User: Can't create user with email: ", user.email, " because: ", err);
      }

      if (callback) {
        callback(err);
      }
    });
  },
  addRandoToUserOutByEmail(email, rando, callback) {
    winston.info("DB.User: addRandoToUserOutByEmail by email:", email);
    User.findOneAndUpdate({ email }, { $push: { "out": rando } }, {
      safe: true
    }, function(err) {
      if (callback) {
        callback(err);
      }
    });
  },
  addRandoToUserInByEmail(email, rando, callback) {
    winston.info("DB.User: addRandoToUserInByEmail by email:", email);
    User.findOneAndUpdate({ email }, { $push: { "in": rando } }, {
      safe: true
    }, function(err) {
      if (callback) {
        callback(err);
      }
    });
  },
  addReportForUser (email, reportData, callback) {
    winston.info("DB.User: addReportForUser for email:", email);
    User.findOneAndUpdate({ email }, { $push: { "report": reportData } }, {
      safe: true
    }, (err) => {
      if (callback) {
        callback(err);
      }
    });
  },
  update: function(user, callback) {
    winston.info("DB.User: Update user: ", user.email);
    user.save(function(err) {
      if (err) {
        winston.warn("DB.User: Can't update user with email: ", user.email, " because: ", err);
      }
      if (callback) {
        callback(err);
      }
    });
  },
  updateUserMetaByEmail(email, meta, callback) {
    winston.info("DB.User: updateUserMetaByEmail:", email);
    User.update({ email }, meta, function(err) {
      if (callback) {
        return callback(err);
      }
    });
  },
  updateActiveForAllFirabaseIdsByEmail(email, value, callback) {
    winston.info("DB.User: updateActiveForAllFirabaseIdsByEmail by email: ", email);
    User.findOne({ $and: [{ email }, { "firebaseInstanceIds": { $elemMatch: { active: { $ne: value } } } }] }, { "firebaseInstanceIds.instanceId": 1 }, function(err, doc) {
      if (doc && Array.isArray(doc.firebaseInstanceIds)) {
        async.eachLimit(doc.firebaseInstanceIds, 20, (instanceIdsPair, done) => {
          User.update({ $and: [{ email }, { "firebaseInstanceIds.instanceId": instanceIdsPair.instanceId }] }, {
            $set: {
              "firebaseInstanceIds.$.active": value
            }
          }, done);
        }, callback);
      } else {
        callback();
      }
    }).lean();
  },
  updateOutRandoProperties(email, randoId, properties, callback) {
    for (var property in properties) {
      properties["out.$." + property] = properties[property];
      delete properties[property];
    }

    winston.info("DB.User: updateOutRandoProperties by email:", email, "and randoId:", randoId, "set properties:", properties);
    User.update({ $and: [{ email }, { "out.randoId": randoId }] }, { $set: properties }, function(err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateInRandoProperties(email, randoId, properties, callback) {
    for (var property in properties) {
      properties["in.$." + property] = properties[property];
      delete properties[property];
    }

    winston.info("DB.User: updateInRandoProperties by email:", email, "and randoId:", randoId, "set properties:", properties);
    User.update({ $and: [{ email }, { "in.randoId": randoId }] }, { $set: properties }, function(err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  updateChosenRandoIdForOutRando(email, randoId, chosenRandoId, callback) {
    winston.info("DB.User: updateChosenRandoIdForOutRando by email:", email, "and randoId:", randoId);
    User.update({ $and: [{ email }, { "out.randoId": randoId }] }, {
      $set: {
        "out.$.chosenRandoId": chosenRandoId
      }
    }, function(err, data) {
      if (callback) {
        return callback(err, data);
      }
    });
  },
  mapReduce (o, result) {
    winston.info("DB.User: mapReduce");
    User.mapReduce(o, result);
  },
  //WARN!!! Use this method only for tests
  getAll (callback) {
    winston.info("DB.User: get all users");
    User.find({}, callback);
  },
  //WARN!!! Use this method only for tests
  removeAll (callback) {
    winston.warn("DB.User: DELETE ALL USERS!");
    User.remove({}, callback);
  },
  //WARN!!! Use this method only for tests
  getByEmailLight (email, callback) {
    winston.info("DB.User: Get by email: ", email);
    User.findOne({email}, callback).lean();
  },
  //deprecated
  getByEmail: function(email, callback) {
    winston.info("DB.User: Get by email: ", email);
    User.findOne({email}, callback);
  },

  //deprecated
  getById: function(id, callback) {
    winston.info("DB.User: Get by id: ", id);
    User.findById(id, callback);
  },
  //deprecated
  getByToken: function(token, callback) {
    winston.info("DB.User: Get by token: ", token);
    User.findOne({ authToken: token }, callback);
  },
  //deprecated
  getEmailsAndRandosNumberArray: function(callback) {
    winston.info("DB.User: mapReduce: get emails and randos");
    User.mapReduce({
      map: function() {
        emit(this.email, this.randos.length);
      },
      reduce: function(k, vals) {
        return vals;
      }
    }, function(err, emails) {
      async.each(emails, function(email, done) {
        email.email = email["_id"];
        email.randos = email.value;
        delete email["_id"];
        delete email.value;
        done();
      }, function(err) {
        callback(err, emails);
      });
    });
  }
};
