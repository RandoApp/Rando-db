var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");
var async = require("async");

describe("randoDB.", () => {
	it("Should connect successfully and callback without error and disconnect", (done) => {
		 db.connect(config.test.db.url,err => {
		 	should.not.exist(err);
		 	db.user.getAll(function(err, users) {
			should.not.exist(err);
			users.should.have.length(0);
		 	db.disconnect(done);
		 });
		 });
	});
	it("Should Not connect and callback with error when bad url passed", (done) => {
		 db.connect("NOT_A_MONGO_URL",err => {
		 	should.exist(err);
		 	db.disconnect(done);
		 });
	});
});
