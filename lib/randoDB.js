var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");

module.exports = {
    connect: function (mongoURL) {
	mongoose.connect(mongoURL);
	var db = mongoose.connection;

	db.on("error", function (e) {
	    logger.error("Monodb connection error: " + e);
	});

	db.on("open", function () {
	    logger.info("Connection to mongodb established");
	});
	return db;
    },
    user: user,
    rando: rando
};
