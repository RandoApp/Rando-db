var chai = require("chai");
var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");

chai.use(require("chai-datetime"));

var should = chai.should();

describe("User.", function() {
    before(function(done) {
        db.connect(config.test.db.url, function() {
            done();
        });
    });

    after(function(done) {
        db.disconnect(done);
    });

    afterEach(function(done) {
        db.user.removeAll(done);
    });

    describe("create", function() {
        it("Should create user and lower case email", function(done) {
            db.user.create({ "email": "EMAIL@gm.com", "authToken" : "authTokenValue" }, function() {
                db.user.getAll(function(err, users) {
                    should.not.exist(err);
                    users.should.have.length(1);
                    var user = users[0];
                    user.email.should.be.eql("email@gm.com");
                    user.authToken.should.be.eql("authTokenValue");
                    done();
                });
            });
        });

        it("Should fail create when user email is already taken", function(done) {
            db.user.create({ "email": "email@gm.com }, function() {
                db.user.getAll(function(err, users) {
                    should.not.exist(err);
                    users.should.have.length(1);
                    users[0].email.should.be.eql("email@gm.com");
                    db.user.create({ "email": "email@gm.com" }, function(err) {
                        should.exist(err);
                        db.user.getAll(function(err, users) {
                            should.not.exist(err);
                            users.should.have.length(1);
                            users[0].email.should.be.eql("email@gm.com");
                            done();
                        });
                    });
                });
            });
        });
    });

    describe("update", function() {

        beforeEach(function(done) {
            db.user.create({ "email": "email@gm.com" }, done);
        });

        it("Should update user", function(done) {
            db.user.getByEmail("email@gm.com", function(user, err) {
                should.not.exist(err);
                user.email.should.be.eql("email@gm.com");
                user.authToken = "authTokenValue";
                db.user.update(user, function() {
                    should.not.exist(err);
                    db.user.getAll(function(err, users) {
                        should.not.exist(err);
                        users.should.have.length(1);
                        var user = users[0];
                        user.email.should.be.eql("email@gm.com");
                        user.authToken.should.be.eql("authTokenValue");
                        done();
                    });
                });
            });
        });

        it("Should fail create when user email is already taken", function(done) {
            db.user.create({ "email": "email@gm.com" }, function() {
                db.user.getAll(function(err, users) {
                    should.not.exist(err);
                    users.should.have.length(1);
                    users[0].email.should.be.eql("email@gm.com");
                    db.user.create({ "email": "email@gm.com" }, function(err) {
                        should.exist(err);
                        db.user.getAll(function(err, users) {
                            should.not.exist(err);
                            users.should.have.length(1);
                            users[0].email.should.be.eql("email@gm.com");
                            done();
                        });
                    });
                });
            });
        });
    });

});
