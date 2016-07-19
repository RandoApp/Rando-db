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
    }],
    out: [{
        email: String,
        randoId: String,
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
