var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");
var should = require("should")

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

  describe("create.", function() {
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

  describe("update.", function() {
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

  describe("updateUserMetaByEmail.", function() {
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
        createdDate: createdDate,
        lastUsedDate: lastUsedDate
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

  describe("updateActiveForAllFirabaseIdsByEmail.", function() {
    beforeEach(function(done) {
      var createdDate = Date.now();
      var lastUsedDate = createdDate + 10;

      var firebaseInstanceIds = [{
        instanceId: "instanceId1",
        active: 1,
        createdDate: createdDate,
        lastUsedDate: lastUsedDate
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
      db.user.create({ "email": "email@gm.com", firebaseInstanceIds: firebaseInstanceIds }, done);
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
  });
});
