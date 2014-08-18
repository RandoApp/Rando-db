var mongoose = require("mongoose");
var winston = require("winston");
var user = require("./user");
var rando = require("./rando");

module.exports = {
    connect: function (mongoURL) {
	mongoose.connect(mongoURL);
	var db = mongoose.connection;

	db.on("error", function (e) {
	    console.error("Monodb connection error: " + e);
	});

	db.on("open", function () {
	    console.info("Connection to mongodb established");
	});
	return db;
    },
    disconnect: function () {
	mongoose.disconnect();
        console.info("Connections to mongodb closed");
    },
    user: user,
    rando: rando
};
