var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");
var async = require("async");

describe("db.user.", () => {

  before((done) => {
     db.connect(config.test.db.url,done);
  });

  after((done) => {
     db.disconnect(done);
  });

  afterEach((done) => {
    db.user.removeAll(done);
  });

  describe("create", () => {
    it("Should create user and lower case email", (done) => {
      db.user.create({ "email": "EMAIL@gm.com", "authToken": "authTokenValue" }, () => {
        db.user.getAll((err, users) => {
          should.not.exist(err);
          users.should.have.length(1);
          var user = users[0];
          user.email.should.be.eql("email@gm.com");
          user.authToken.should.be.eql("authTokenValue");
          done();
        });
      });
    });

    it("Should fail create when user email is already taken", (done) => {
      db.user.create({ email: "unique-email@gm.com", password: "123" }, () => {
        db.user.getAll((err, users) => {
          should.not.exist(err);
          users.should.have.length(1);
          users[0].email.should.be.eql("unique-email@gm.com");
          db.user.create({ email: "unique-email@gm.com", password: "456" }, (err) => {
            should.exist(err);
            db.user.getAll((err, users) => {
              should.not.exist(err);
              users.should.have.length(1);
              users[0].email.should.be.eql("unique-email@gm.com");
              users[0].password.should.be.eql("123");
              done();
            });
          });
        });
      });
    });
  });

  describe("update", () => {
    beforeEach((done) => {
      db.user.create({ "email": "email@gm.com" }, done);
    });

    it("Should update user", (done) => {
      db.user.getByEmail("email@gm.com", (err, user) => {
        should.exist(user);
        should.not.exist(err);
        user.email.should.be.eql("email@gm.com");
        user.authToken = "authTokenValue";
        db.user.update(user, (err) => {
          should.not.exist(err);
          db.user.getByEmail("email@gm.com", (err, user) => {
            should.not.exist(err);
            user.email.should.be.eql("email@gm.com");
            user.authToken.should.be.eql("authTokenValue");
            done();
          });
        });
      });
    });

    it("Should Not throw err when update user with not allowed field", (done) => {
      db.user.getByEmail("email@gm.com", (err, user) => {
        should.exist(user);
        should.not.exist(err);
        user.email.should.be.eql("email@gm.com");
        user.authToken = "authTokenValue";
        user.notAllowed = "Not Allowed";
        db.user.update(user, (err) => {
          should.not.exist(err);
          db.user.getByEmail("email@gm.com", (err, user) => {
            should.not.exist(err);
            user.should.not.have.property("notAllowed");
            user.email.should.be.eql("email@gm.com");
            user.authToken.should.be.eql("authTokenValue");
            done();
          });
        });
      });
    });
  });

  describe("updateUserMetaByEmail", () => {
    beforeEach((done) => {
      db.user.create({ "email": "email@gm.com" }, done);
    });

    it("Should update user authToken", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { authToken: "authTokenValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.authToken.should.be.eql("authTokenValue");
          done();
        });
      });
    });

    it("Should update user facebookId", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { facebookId: "facebookIdValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.facebookId.should.be.eql("facebookIdValue");
          done();
        });
      });
    });

    it("Should update user googleId", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { googleId: "googleIdValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.googleId.should.be.eql("googleIdValue");
          done();
        });
      });
    });

    it("Should update user anonymousId", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { anonymousId: "anonymousIdValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.anonymousId.should.be.eql("anonymousIdValue");
          done();
        });
      });
    });

    it("Should update user password", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { password: "passwordValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.password.should.be.eql("passwordValue");
          done();
        });
      });
    });

    it("Should update user ip", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { ip: "ipValue" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.ip.should.be.eql("ipValue");
          done();
        });
      });
    });

    it("Should update user ban", (done) => {
      var banDate = new Date().getTime();
      db.user.updateUserMetaByEmail("email@gm.com", { ban: banDate }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.ban.should.be.eql(banDate);
          done();
        });
      });
    });

    it("Should update empty firebaseInstanceIds", (done) => {
      var newFirebaseInstanceIds = [];
      db.user.updateUserMetaByEmail("email@gm.com", { firebaseInstanceIds: newFirebaseInstanceIds }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(0);
          done();
        });
      });
    });

    it("Should update with array of firebaseInstanceIds", (done) => {
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
      db.user.updateUserMetaByEmail("email@gm.com", { firebaseInstanceIds: newFirebaseInstanceIds }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          user.firebaseInstanceIds.should.exist;
          user.firebaseInstanceIds.should.have.length(2);
          user.firebaseInstanceIds.should.containDeep(newFirebaseInstanceIds);
          done();
        });
      });
    });

    it("Should not update not existing", (done) => {
      db.user.updateUserMetaByEmail("email@gm.com", { notExist: "Not Exist" }, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
          should.not.exist(err);
          user.email.should.be.eql("email@gm.com");
          should.not.exist(user.notExist);
          done();
        });
      });
    });
  });

  describe("updateActiveForAllFirabaseIdsByEmail", () => {
    beforeEach((done) => {
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

    it("Should update Active to false For All FirabaseIds By Email", (done) => {
      db.user.updateActiveForAllFirabaseIdsByEmail("email@gm.com", 0, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
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

    it("Should update Active to true For All FirabaseIds By Email", (done) => {
      db.user.updateActiveForAllFirabaseIdsByEmail("email@gm.com", 1, (err) => {
        should.not.exist(err);
        db.user.getByEmail("email@gm.com", (err, user) => {
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

    it("Should not fail when no such user By Email", (done) => {
      db.user.updateActiveForAllFirabaseIdsByEmail("notExist@gm.com", 1, (err) => {
        should.not.exist(err);
        db.user.getByEmail("notExist@gm.com", (err, user) => {
          should.not.exist(err);
          should.not.exist(user);
          done();
        });
      });
    });

    it("Should not fail and call callback when user doesn't have any FirabaseIds", (done) => {
      db.user.create({ email: "email2@gm.com" }, (err) => {
        db.user.updateActiveForAllFirabaseIdsByEmail("email2@gm.com", 1, (err) => {
          should.not.exist(err);
          db.user.getByEmail("email2@gm.com", (err, user) => {
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

  describe("getLightUserByToken", () => {
    beforeEach((done) => {
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

    it("Should return null when no such user by token", (done) => {
      db.user.getLightUserByToken("no_such_token", (err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return light user when single user is in DB with matching token", (done) => {
      db.user.getLightUserByToken("authTokenValue", (err, user) => {
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
    it("Should return light user when multiple users are in DB and one with matching token", (done) => {
      db.user.create({ email: "email2@gm.com", authToken: "authTokenValue2", ip: "127.0.0.0", ban: 0 }, (err) => {
        should.not.exist(err);
        db.user.getLightUserByToken("authTokenValue", (err, user) => {
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

  describe("addReportForUser. ", () => {
    beforeEach((done) => {
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

  describe("getLightUserByEmail", () => {
    beforeEach((done) => {
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
      db.user.create({ email: "user1@rando4.me", authToken: "authTokenValue", ip: "127.0.0.1", ban: 1, password: "123", googleId: "456", anonymousId: "anony@rando4.me", firebaseInstanceIds }, done);
    });

    it("Should return null when no such user by email", (done) => {
      db.user.getLightUserByEmail("no_such_email", (err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return light user when single user is in DB with matching token", (done) => {
      db.user.getLightUserByEmail("user1@rando4.me", (err, user) => {
        should.not.exist(err);
        should.exist(user);
        user.should.have.properties({ email: "user1@rando4.me", authToken: "authTokenValue", ip: "127.0.0.1", ban: 1, password: "123", googleId: "456", anonymousId: "anony@rando4.me" });
        user.firebaseInstanceIds[0].active.should.be.eql(1);
        user.firebaseInstanceIds[0].instanceId.should.be.eql("instanceId1");
        user.firebaseInstanceIds[1].instanceId.should.be.eql("instanceId2");
        user.firebaseInstanceIds[1].active.should.be.eql(0);
        done();
      });
    });
  });

  describe("getLightUserMetaByOutRandoId. ", () => {
    beforeEach((done) => {
      var user = {
        email: "user@rando4.me",
        report: [{
          reportedBy: "user1@rando4.me",
          reason: "Reported by user1@rando4.me because randoId: 3",
          reportedDate: 987654321,
          randoId: "2"
        }],
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

      async.parallel([
        (parallelDone) => {
          db.user.create(user, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me"
          }, parallelDone);
        }
      ], (err) => {
        done();
      });
    });

    it("Should find user by out randoId", (done) => {
      db.user.getLightUserMetaByOutRandoId(4, (err, user) => {
        should.not.exist(err);
        should.exist(user);
        user.report.should.have.length(1);
        user.should.have.property("email", "user@rando4.me");
        user.report[0].should.have.properties({
          reportedBy: "user1@rando4.me",
          reason: "Reported by user1@rando4.me because randoId: 3",
          reportedDate: 987654321,
          randoId: "2"
        });
        should.not.exist(user.in);
        should.not.exist(user.out);
        done();
      });
    });

    it("Should not find user when randoId does not exist", (done) => {
      db.user.getLightUserMetaByOutRandoId(412345678, (err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

  });

  describe("getBannedUsers. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
            ban: 9999,
            report: [{
              reportedBy: "user1@rando4.me",
              reason: "Reported by user1@rando4.me because randoId: 3",
              reportedDate: 987654321,
              randoId: "2"
            }],
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
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
            report: [{
              reportedBy: "user2@rando4.me",
              reason: "Reported by user1@rando4.me because randoId: 3",
              reportedDate: 987654321,
              randoId: "2"
            }],
             in: [{
              randoId: 3,
              report: 1,
              delete: 1
            }],
            out: [{
              randoId: 4,
              report: 0,
              delete: 0
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user3@rando4.me",
            ban: 1,
            report: [{
              reportedBy: "user1@rando4.me",
              reason: "Reported by user1@rando4.me because randoId: 3",
              reportedDate: 987654321,
              randoId: "2"
            }],
             in: [],
            out: []
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should find first banned users when offset 0", (done) => {
      db.user.getBannedUsers(1, 99999, 0, 1, (err, users) => {
        should.not.exist(err);
        should.exist(users);
        users.should.have.length(1);
        users[0].should.have.property("email", "user1@rando4.me");
        done();
      });
    });

    it("Should find second banned users when offset 1", (done) => {
      db.user.getBannedUsers(1, 99999, 1, 1, (err, users) => {
        should.not.exist(err);
        should.exist(users);
        users.should.have.length(1);
        users[0].should.have.property("email", "user3@rando4.me");
        done();
      });
    });

    it("Should find all banned users when offset 0 and big limit", (done) => {
      db.user.getBannedUsers(1, 99999, 0, 9999, (err, users) => {
        should.not.exist(err);
        should.exist(users);
        users.should.have.length(2);
        users[0].should.have.property("email", "user1@rando4.me");
        users[1].should.have.property("email", "user3@rando4.me");
        done();
      });
    });

    it("Should return emtpy when offset and limit are 0", (done) => {
      db.user.getBannedUsers(1, 99999, 0, 0, (err, users) => {
        should.not.exist(err);
        should.exist(users);
        users.should.have.length(0);
        done();
      });
    });

  });

describe("getLightRandoByRandoId. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
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
              delete: 0,
              originalFileName : "file_name_4.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
             in: [{
              randoId: 3,
              report: 1,
              delete: 1
            }],
            out: [{
              randoId: 5,
              email : "user2@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user3@rando4.me",
            ban: 1,
             in: [],
            out: []
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should not return any when not exist by id", (done) => {
      db.user.getLightRandoByRandoId(7 ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return when exist by id", (done) => {
      db.user.getLightRandoByRandoId(5 ,(err, user) => {
        should.not.exist(err);
        should.exist(user);
        should.exist(user.out);
        user.out.should.have.length(1);
        user.out[0].should.have.property("randoId","5");
        user.out[0].should.have.property("email", "user2@rando4.me");
        user.out[0].should.have.property("delete", 0);
        user.out[0].should.have.property("report", 0);
        user.out[0].should.have.property("originalFileName", "file_name_5.jpg");
        done();
      });
    });
  });

describe("getLightOutRandoByOrigianlFileName. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
             in: [{
              randoId: 1,
              report: 0,
              delete: 0
            }],
            out: [{
              randoId: 4,
              report: 0,
              delete: 0,
              originalFileName : "file_name_4.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
             in: [],
            out: [{
              randoId: 5,
              email : "user2@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should not return any when no such user by email, but there is file by originalFileName", (done) => {
      db.user.getLightOutRandoByOrigianlFileName("user_NOT_EXIST@rando4.me", "file_name_5.jpg" ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should not return any when not exist by originalFileName", (done) => {
      db.user.getLightOutRandoByOrigianlFileName("user2@rando4.me", "file_name_Not_Exist.jpg" ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return when exist by originalFileName", (done) => {
      db.user.getLightOutRandoByOrigianlFileName("user2@rando4.me", "file_name_5.jpg" ,(err, user) => {
        should.not.exist(err);
        should.exist(user);
        should.exist(user.out);
        user.out.should.have.length(1);
        user.out[0].should.have.property("randoId","5");
        user.out[0].should.have.property("email", "user2@rando4.me");
        user.out[0].should.have.property("delete", 0);
        user.out[0].should.have.property("report", 0);
        user.out[0].should.have.property("originalFileName", "file_name_5.jpg");
        done();
      });
    });
  });

describe("getAllLightOutRandosByEmail. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
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
              email: "user1@rando4.me",
              report: 0,
              delete: 0,
              creation: 100,
              originalFileName : "file_name_4.jpg"
            },
            {
              randoId: 10,
              email: "user1@rando4.me",
              report: 0,
              delete: 0,
              creation: 200,
              originalFileName : "file_name_10.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
             in: [{
              randoId: 3,
              report: 1,
              delete: 1
            }],
            out: [{
              randoId: 5,
              email : "user2@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user3@rando4.me",
            ban: 1,
             in: [],
            out: []
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should not return any when not exist by email", (done) => {
      db.user.getAllLightOutRandosByEmail("email_not_exist@rando4.me", 10 ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });

    it("Should return all randos when exist by email", (done) => {
      db.user.getAllLightOutRandosByEmail("user1@rando4.me", 10 ,(err, user) => {
        should.not.exist(err);
        should.exist(user);
        user.should.not.have.property("email");
        user.out.should.have.lengthOf(2);
        user.out[0].should.not.have.property("email");
        user.out[0].should.not.have.property("delete");
        user.out[0].should.not.have.property("report");
        user.out[0].should.not.have.property("originalFileName");
        user.out[0].should.have.property("randoId", "4");
        user.out[0].should.have.property("creation", 100);

        user.out[1].should.not.have.property("email");
        user.out[1].should.not.have.property("delete");
        user.out[1].should.not.have.property("report");
        user.out[1].should.not.have.property("originalFileName");
        user.out[1].should.have.property("randoId", "10");
        user.out[1].should.have.property("creation", 200);
        done();
      });
    });
  });

describe("addRandoToUserOutByEmail. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
            ban: 0,
             in: [{
              randoId: 3,
              report: 1,
              delete: 1
            }],
            out: [{
              randoId: 5,
              email : "user1@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 1,
             in: [],
            out: []
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should not do anything when no such user by email", (done) => {
      var rando = {
        randoId: 5,
        email : "user7@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_5.jpg"
      };
      db.user.addRandoToUserOutByEmail("user7@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
              async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(0);
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should insert second out rando when such user exist by email", (done) => {
      var rando = {
        randoId: 7,
        email : "user1@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_7.jpg"
      };
      db.user.addRandoToUserOutByEmail("user1@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
              async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(2);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          user.out[1].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(0);
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should insert first out rando when such user exist by email and users out is empty", (done) => {
      var rando = {
        randoId: 7,
        email : "user2@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_7.jpg"
      };
      db.user.addRandoToUserOutByEmail("user2@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
              async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

  });

describe("addRandoToUserInByEmail. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
            ban: 0,
             out: [{
              randoId: 3,
              report: 1,
              delete: 1
            }],
            in: [{
              randoId: 5,
              email : "user1@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 1,
             in: [],
            out: []
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should not do anything when no such user by email", (done) => {
      var rando = {
        randoId: 5,
        email : "user7@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_5.jpg"
      };
      db.user.addRandoToUserInByEmail("user7@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
              async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(0);
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should insert second out rando when such user exist by email", (done) => {
      var rando = {
        randoId: 7,
        email : "user1@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_7.jpg"
      };
      db.user.addRandoToUserInByEmail("user1@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
              async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(2);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          user.in[1].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(0);
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should insert first out rando when such user exist by email and users out is empty", (done) => {
      var rando = {
        randoId: 7,
        email : "user2@rando4.me",
        report: 0,
        delete: 0,
        originalFileName : "file_name_7.jpg"
      };
      db.user.addRandoToUserInByEmail("user2@rando4.me", rando ,(err, user) => {
        should.not.exist(err);
        should.not.exist(user);
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });
  });

describe("updateDeleteFlagForOutRando. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
            ban: 0,
             in: [{
              randoId: 7,
              email: "user1@rando4.me",
              report: 1,
              delete: 2
            }],
            out: [{
              randoId: 5,
              email : "user1@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
             in: [],
            out: [{
              randoId: 7,
              email : "user2@rando4.me",
              report: 0,
              delete: 0,
              originalFileName : "file_name_7.jpg"
            }]
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should do nothing when updating delete flag for out rando and no such user by email", (done) => {
      db.user.updateOutRandoProperties("user10@rando4.me", 5, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.nModified.should.be.eql(0);
        result.n.should.be.eql(0);
        result.ok.should.be.eql(1);
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 0, email: "user1@rando4.me", originalFileName: "file_name_5.jpg"});
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 1, delete: 2, email: "user1@rando4.me"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should do nothing when updating delete flag for out rando and user doesn't have such out rando by Id", (done) => {
      db.user.updateOutRandoProperties("user1@rando4.me", 10, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.nModified.should.be.eql(0);
        result.n.should.be.eql(0);
        result.ok.should.be.eql(1);
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 0, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 1, delete: 2, email: "user1@rando4.me"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should update delete flag for rando out by user email and by randoId", (done) => {
      db.user.updateOutRandoProperties("user1@rando4.me", 5, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.should.have.properties({nModified:1, n:1, ok : 1});
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "5", report: 0, delete: 1, email : "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 1, delete: 2, email: "user1@rando4.me"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me", originalFileName : "file_name_7.jpg"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });
  });

describe("updateInRandoProperties. ", () => {

    beforeEach((done) => {
      async.parallel([
        (parallelDone) => {
          db.user.create({
            email: "user1@rando4.me",
            ban: 0,
             out: [{
              randoId: 7,
              email: "user1@rando4.me",
              report: 1,
              delete: 0,
              originalFileName : "file_name_5.jpg"
            }],
            in: [{
              randoId: 5,
              email : "user1@rando4.me",
              report: 0,
              delete: 2
            }]
          }, parallelDone);
        },
        (parallelDone) => {
          db.user.create({
            email: "user2@rando4.me",
            ban: 0,
             out: [],
            in: [{
              randoId: 7,
              email : "user2@rando4.me",
              report: 0,
              delete: 0
            }]
          }, parallelDone);
        }
      ], (err) => {
        done(err);
      });
    });

    it("Should do nothing when updating delete flag for in rando and no such user by email", (done) => {
      db.user.updateInRandoProperties("user10@rando4.me", 5, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.nModified.should.be.eql(0);
        result.n.should.be.eql(0);
        result.ok.should.be.eql(1);
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 2, email: "user1@rando4.me"});
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 1, delete: 0, email: "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should do nothing when updating delete flag for in rando and user doesn't have such in rando by Id", (done) => {
      db.user.updateInRandoProperties("user1@rando4.me", 10, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.nModified.should.be.eql(0);
        result.n.should.be.eql(0);
        result.ok.should.be.eql(1);
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 2, email : "user1@rando4.me"});
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 1, delete: 0, email: "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });

    it("Should update delete flag for in rando by user email and by randoId", (done) => {
      db.user.updateInRandoProperties("user1@rando4.me", 5, {delete: 1}, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.should.have.properties({nModified:1, n:1, ok : 1});
        async.parallel([
        (parallelDone) => {
          db.user.getByEmailLight("user1@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "5", report: 0, delete: 1, email : "user1@rando4.me"});
          user.out.should.have.length(1);
          user.out[0].should.have.properties({randoId: "7", report: 1, delete: 0, email: "user1@rando4.me", originalFileName : "file_name_5.jpg"});
          parallelDone();
        });
        },
        (parallelDone) => {
          db.user.getByEmailLight("user2@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(1);
          user.in[0].should.have.properties({randoId: "7", report: 0, delete: 0, email : "user2@rando4.me"});
          parallelDone();
        });
        }
      ], (err) => {
        done(err);
      });
      });
    });
  });

});
