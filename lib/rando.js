var mongoose = require("mongoose");

var Rando = mongoose.model("rando", new mongoose.Schema({
    email: String,
    randoId: {type: String, unique: true},
    creation: Number,
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
    report: Number
}));

module.exports = {
    add: function (rando, callback) {
	console.info("DB.Rando: Add rando by: ", rando.email);
	new Rando(rando).save(callback);
    },
    getAll: function (callback) {
	console.info("DB.Rando: get all");
	Rando.find({}, callback);
    },
    remove: function (rando, callback) {
	console.info("Db.Rando: Remove rando: ", rando.emai, " randoId: ", rando.randoId);
	rando.remove(function (err) {
	    if (err) {
                console.warn("DB.Rando: Can't remove rando: " , rando.randoId, " because: ", err);
            }

            if (callback) {
                callback(err);
            }
	});
    },
    update: function (rando, callback) {
	console.info("DB.Rando: Update rando: ", rando.email, " randoId: ", rando.randoId);
	rando.save(function (err) {
		if (err) {
		    console.warn("DB.Rando: Can't update rando: " , rando.randoId, " because: ", err);
                }

                if (callback) {
                    callback(err);
                }
	});
    }
}
