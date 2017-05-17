var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");
var async = require("async");

describe("db.user.", function() {
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
      db.user.create({ "email": "EMAIL@gm.com", "authToken": "authTokenValue" }, function() {
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

  describe("update", function() {
    beforeEach(function(done) {
      db.user.create({ "email": "email@gm.com" }, done);
    });

    it("Should update user", function(done) {
      db.user.getByEmail("email@gm.com", function(err, user) {
        should.exist(user);
        should.not.exist(err);
        user.email.should.be.eql("email@gm.com");
        user.authToken = "authTokenValue";
        db.user.update(user, function(err) {
          should.not.exist(err);
          db.user.getByEmail("email@gm.com", function(err, user) {
            should.not.exist(err);
            user.email.should.be.eql("email@gm.com");
            user.authToken.should.be.eql("authTokenValue");
            done();
          });
        });
      });
    });
  });

  describe("updateUserMetaByEmail", function() {
    beforeEach(function(done) {
      db.user.create({ "email": "email@gm.com" }, done);
    });

    it("Should update user authToken", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { authToken: "authTokenValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.authToken.should.be.eql("authTokenValue");
          done();
        });
      });
    });

    it("Should update user facebookId", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { facebookId: "facebookIdValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.facebookId.should.be.eql("facebookIdValue");
          done();
        });
      });
    });

    it("Should update user googleId", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { googleId: "googleIdValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.googleId.should.be.eql("googleIdValue");
          done();
        });
      });
    });

    it("Should update user anonymousId", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { anonymousId: "anonymousIdValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.anonymousId.should.be.eql("anonymousIdValue");
          done();
        });
      });
    });

    it("Should update user password", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { password: "passwordValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.password.should.be.eql("passwordValue");
          done();
        });
      });
    });

    it("Should update user ip", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { ip: "ipValue" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.ip.should.be.eql("ipValue");
          done();
        });
      });
    });

    it("Should update user ban", function(done) {
      var banDate = new Date().getTime();
      db.user.updateUserMetaByEmail("email@gm.com", { ban: banDate }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.ban.should.be.eql(banDate);
          done();
        });
      });
    });

    it("Should update empty firebaseInstanceIds", function(done) {
      var newFirebaseInstanceIds = [];
      db.user.updateUserMetaByEmail("email@gm.com", { firebaseInstanceIds: newFirebaseInstanceIds }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(0);
          done();
        });
      });
    });

    it("Should update with array of firebaseInstanceIds", function(done) {
      var createdDate = new Date().getTime();
      var lastUsedDate = new Date().getTime();

      var newFirebaseInstanceIds = [{
        instanceId: "instanceId1",
        active: 1,
        createdDate,
        lastUsedDate
      }, {
        instanceId: "instanceId2",
        active: 0,
        createdDate: createdDate + 10,
        lastUsedDate: lastUsedDate + 10
      }];
      db.user.updateUserMetaByEmail("email@gm.com", { firebaseInstanceIds: newFirebaseInstanceIds }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(2);
          user.firebaseInstanceIds.should.containDeep(newFirebaseInstanceIds);
          done();
        });
      });
    });

    it("Should not update not existing", function(done) {
      db.user.updateUserMetaByEmail("email@gm.com", { notExist: "Not Exist" }, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          should.not.exist(user.notExist);
          done();
        });
      });
    });
  });

  describe("updateActiveForAllFirabaseIdsByEmail", function() {
    beforeEach(function(done) {
      var createdDate = Date.now();
      var lastUsedDate = createdDate + 10;

      var firebaseInstanceIds = [{
        instanceId: "instanceId1",
        active: 1,
        createdDate,
        lastUsedDate
      }, {
        instanceId: "instanceId2",
        active: 0,
        createdDate: createdDate + 10,
        lastUsedDate: lastUsedDate + 10
      }, {
        instanceId: "instanceId3",
        active: 2,
        createdDate: createdDate + 20,
        lastUsedDate: lastUsedDate + 20
      }];
      db.user.create({ "email": "email@gm.com", firebaseInstanceIds }, done);
    });

    it("Should update Active to false For All FirabaseIds By Email", function(done) {
      db.user.updateActiveForAllFirabaseIdsByEmail("email@gm.com", 0, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          should.exist(user);
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(3);
          user.firebaseInstanceIds[0].active.should.be.eql(0);
          user.firebaseInstanceIds[1].active.should.be.eql(0);
          user.firebaseInstanceIds[2].active.should.be.eql(0);
          done();
        });
      });
    });

    it("Should update Active to true For All FirabaseIds By Email", function(done) {
      db.user.updateActiveForAllFirabaseIdsByEmail("email@gm.com", 1, function(err) {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", function(err, user) {
          should.not.exist(err);
          should.exist(user);
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(3);
          user.firebaseInstanceIds[0].active.should.be.eql(1);
          user.firebaseInstanceIds[1].active.should.be.eql(1);
          user.firebaseInstanceIds[2].active.should.be.eql(1);
          done();
        });
      });
    });

    it("Should not fail when no such user By Email", function(done) {
      db.user.updateActiveForAllFirabaseIdsByEmail("notExist@gm.com", 1, function(err) {
        should.not.exist(err);
        db.user.getByEmail("notExist@gm.com", function(err, user) {
          should.not.exist(err);
          should.not.exist(user);
          done();
        });
      });
    });

    it("Should not fail and call callback when user doesn't have any FirabaseIds", function(done) {
      db.user.create({ email: "email2@gm.com" }, function(err) {
        db.user.updateActiveForAllFirabaseIdsByEmail("email2@gm.com", 1, function(err) {
          should.not.exist(err);
          db.user.getByEmail("email2@gm.com", function(err, user) {
            should.not.exist(err);
            should.exist(user);
            should.exist(user.firebaseInstanceIds);
            user.firebaseInstanceIds.should.have.length(0);
            done();
          });
        });
      });
    });
  });

  describe("getLightUserByToken", function() {
    beforeEach(function(done) {
      var createdDate = Date.now();
      var lastUsedDate = createdDate + 10;

      var firebaseInstanceIds = [{
        instanceId: "instanceId1",
        active: 1,
        createdDate,
        lastUsedDate
      }, {
        instanceId: "instanceId2",
        active: 0,
        createdDate: createdDate + 10,
        lastUsedDate: lastUsedDate + 10
      }];
      db.user.create({ email: "email@gm.com", authToken: "authTokenValue", ip: "127.0.0.1", ban: 1, firebaseInstanceIds }, done);
    });

    it("Should return null when no such user by token", function(done) {
      db.user.getLightUserByToken("no_such_token", function(err, user) {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return light user when single user is in DB with matching token", function(done) {
      db.user.getLightUserByToken("authTokenValue", function(err, user) {
        should.not.exist(err);
        should.exist(user);
        user.email.should.be.eql("email@gm.com");
        user.ip.should.be.eql("127.0.0.1");
        user.authToken.should.be.eql("authTokenValue");
        user.ban.should.be.eql(1);
        user.firebaseInstanceIds.should.have.length(2);
        user.firebaseInstanceIds[0].active.should.be.eql(1);
        user.firebaseInstanceIds[0].instanceId.should.be.eql("instanceId1");
        user.firebaseInstanceIds[1].instanceId.should.be.eql("instanceId2");
        user.firebaseInstanceIds[1].active.should.be.eql(0);
        done();
      });
    });
    it("Should return light user when multiple users are in DB and one with matching token", function(done) {
      db.user.create({ email: "email2@gm.com", authToken: "authTokenValue2", ip: "127.0.0.0", ban: 0 }, function(err) {
        should.not.exist(err);
        db.user.getLightUserByToken("authTokenValue", function(err, user) {
          should.not.exist(err);
          should.exist(user);
          user.email.should.be.eql("email@gm.com");
          user.ip.should.be.eql("127.0.0.1");
          user.authToken.should.be.eql("authTokenValue");
          user.ban.should.be.eql(1);
          user.firebaseInstanceIds.should.have.length(2);
          user.firebaseInstanceIds[0].active.should.be.eql(1);
          user.firebaseInstanceIds[0].instanceId.should.be.eql("instanceId1");
          user.firebaseInstanceIds[1].instanceId.should.be.eql("instanceId2");
          user.firebaseInstanceIds[1].active.should.be.eql(0);
          done();
        });
      });
    });
  });

  describe("updateReportFlagForInRando. ", function() {
    beforeEach(function(done) {
      var user = {
        email: "user@rando4.me",
        report: [],
        in: [{
          randoId: 1,
          report: 0,
          delete: 0
        }, {
          randoId: 2,
          report: 0,
          delete: 0
        }, {
          randoId: 3,
          report: 1,
          delete: 1
        }],
        out: [{
          randoId: 4,
          report: 0,
          delete: 0
        }]
      };
      
      db.user.create(user, done);
    });

    it("Should update report to 1 for in rando by email and randoId", (done) => {
      db.user.updateReportFlagForInRando("user@rando4.me", 2, 1, (err) => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(3);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 1, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1});
          done();
        });
      });
    });

    it("Should update report to 0 for in rando by email and randoId", (done) => {
      db.user.updateReportFlagForInRando("user@rando4.me", 3, 0, (err) => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(3);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 0, delete: 1});
          done();
        });
      });
    });
  });

  describe("addReportForUser. ", function() {
    beforeEach(function(done) {
      var user = {
        email: "user@rando4.me",
        report: [],
        in: [{
          randoId: 1,
          report: 0,
          delete: 0
        }, {
          randoId: 2,
          report: 0,
          delete: 0
        }, {
          randoId: 3,
          report: 1,
          delete: 1
        }],
        out: [{
          randoId: 4,
          report: 0,
          delete: 0
        }]
      };
      
      db.user.create(user, done);
    });

    it("Should add report data by email", (done) => {
      var now = Date.now();
      var reportData = {
        reportedBy: "user1@rando4.me",
        reason: "Reported by user1@rando4.me because randoId: 3",
        reportedDate: now,
        randoId: "2"
      };

      db.user.addReportForUser("user@rando4.me", reportData, (err) => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.report.should.have.length(1);
          user.report[0].should.have.properties({
            reportedBy: "user1@rando4.me",
            reason: "Reported by user1@rando4.me because randoId: 3",
            reportedDate: now,
            randoId: "2"
          });
          done();
        });
      });
    });

    it("Should add report a lot of data by email", (done) => {
      var now = Date.now();
      var reportData = [{
        reportedBy: "user1@rando4.me",
        reason: "Reported by user1@rando4.me because randoId: 3",
        reportedDate: now,
        randoId: "2"
      }, {
        reportedBy: "user99@rando4.me",
        reason: "Reported by user99@rando4.me because randoId: 99",
        reportedDate: now,
        randoId: "99"
      }];

      async.eachLimit(reportData, 1, (data, parallelDone) => {
          db.user.addReportForUser("user@rando4.me", data, parallelDone);
      }, (err) => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.report.should.have.length(2);
          user.report[0].should.have.properties({
            reportedBy: "user1@rando4.me",
            reason: "Reported by user1@rando4.me because randoId: 3",
            reportedDate: now,
            randoId: "2"
          });
          user.report[1].should.have.properties({
            reportedBy: "user99@rando4.me",
            reason: "Reported by user99@rando4.me because randoId: 99",
            reportedDate: now,
            randoId: "99"
          });
          done();
        });
      });
    });

  });

});
