var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");

describe("db.user.", () => {

  before(done => {
    db.connect(config.test.db.url,done);
  });

  after(done => {
    db.disconnect(done);
  });

  afterEach(done => {
    db.user.removeAll(done);
  });

  describe("Report field. ", function() {
    beforeEach(mydone => {
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
        }, {
          randoId: 9
        }],
        out: [{
          randoId: 4,
          report: 0,
          delete: 0
        }, {
          randoId: 6
        }]
      };

      db.user.create(user, mydone);
    });

    it("Should update report to 1 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 2, {report: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 1, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1});
          user.in[3].should.have.properties({randoId: "9"});
          done();
        });
      });
    });

    it("Should update report to 0 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 3, {report: 0}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 0, delete: 1});
          user.in[3].should.have.properties({randoId: "9"});
          done();
        });
      });
    });

    it("Should update report to 1 for IN rando by email and randoId when rating field doesn't exist", (done) => {
      db.user.updateInRandoProperties("user@rando4.me", 9, {report: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1});
          user.in[3].should.have.properties({randoId: "9", report: 1});
          done();
        });
      });
    });


    it("Should update report to 1 for OUT rando by email and randoId when rating field doesn't exist", (done) => {
      db.user.updateOutRandoProperties("user@rando4.me", 6, {report: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(2);
          user.out[0].should.have.properties({randoId: "4", report: 0, delete: 0});
          user.out[1].should.have.properties({randoId: "6", report: 1});
          done();
        });
      });
    });
  });


  describe("Delete field. ", function() {
    beforeEach( (done) => {
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
        }, {
          randoId: 9
        }],
        out: [{
          randoId: 4,
          report: 0,
          delete: 0
        }, {
          randoId: 6
        }]
      };

      db.user.create(user, done);
    });

    it("Should update delete to 1 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 2, {delete: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 1});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1});
          user.in[3].should.have.properties({randoId: "9"});
          done();
        });
      });
    });

    it("Should update delete to 0 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 3, {delete: 0}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 0});
          user.in[3].should.have.properties({randoId: "9"});
          done();
        });
      });
    });


    it("Should update delete to 1 for IN rando by email and randoId when delete field doesn't exist", done => {
      db.user.updateInRandoProperties("user@rando4.me", 9, {delete: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(4);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1});
          user.in[3].should.have.properties({randoId: "9", delete: 1});
          done();
        });
      });
    });

    it("Should update delete to 1 for OUT rando by email and randoId when delete field doesn't exist", done => {
      db.user.updateOutRandoProperties("user@rando4.me", 6, {delete: 1}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(2);
          user.out[0].should.have.properties({randoId: "4", report: 0, delete: 0});
          user.out[1].should.have.properties({randoId: "6", delete: 1});
          done();
        });
      });
    });
  });

  describe("Rating field. ", function() {
    beforeEach( done => {
      var user = {
        email: "user@rando4.me",
        report: [],
        in: [{
          randoId: 1,
          report: 0,
          delete: 0,
          rating: 0
        }, {
          randoId: 2,
          report: 0,
          delete: 0,
          rating: 0
        }, {
          randoId: 3,
          report: 1,
          delete: 1,
          rating: 4
        }],
        out: [{
          randoId: 4,
          report: 0,
          delete: 0,
          rating: 0
        }, {
          randoId: 5,
          report: 0,
          delete: 0,
          rating: 4
        }, {
          randoId: 6,
          report: 0,
          delete: 0
        }]
      };

      db.user.create(user, done);
    });

    it("Should update rating to 5 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 2, {rating: 5}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(3);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0, rating: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0, rating: 5});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1, rating: 4});
          done();
        });
      });
    });

    it("Should update rating to 0 for in rando by email and randoId", done => {
      db.user.updateInRandoProperties("user@rando4.me", 3, {rating: 0}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.in.should.have.length(3);
          user.in[0].should.have.properties({randoId: "1", report: 0, delete: 0, rating: 0});
          user.in[1].should.have.properties({randoId: "2", report: 0, delete: 0, rating: 0});
          user.in[2].should.have.properties({randoId: "3", report: 1, delete: 1, rating: 0});
          done();
        });
      });
    });

    it("Should update rating to 0 for out rando by email and randoId", done => {
      db.user.updateOutRandoProperties("user@rando4.me", 5, {rating: 0}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(3);
          user.out[0].should.have.properties({randoId: "4", report: 0, delete: 0, rating: 0});
          user.out[1].should.have.properties({randoId: "5", report: 0, delete: 0, rating: 0});
          user.out[2].should.have.properties({randoId: "6", report: 0, delete: 0});
          done();
        });
      });
    });

    it("Should update rating to 5 for out rando by email and randoId", done => {
      db.user.updateOutRandoProperties("user@rando4.me", 4, {rating: 5}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(3);
          user.out[0].should.have.properties({randoId: "4", report: 0, delete: 0, rating: 5});
          user.out[1].should.have.properties({randoId: "5", report: 0, delete: 0, rating: 4});
          user.out[2].should.have.properties({randoId: "6", report: 0, delete: 0});
          done();
        });
      });
    });

    it("Should update rating to 5 for out rando by email and randoId when rating field doesn't exist", done => {
      db.user.updateOutRandoProperties("user@rando4.me", 6, {rating: 5}, err => {
        should.not.exist(err);
        db.user.getByEmailLight("user@rando4.me", (err, user) => {
          should.not.exist(err);
          should.exist(user);
          user.out.should.have.length(3);
          user.out[0].should.have.properties({randoId: "4", report: 0, delete: 0, rating: 0});
          user.out[1].should.have.properties({randoId: "5", report: 0, delete: 0, rating: 4});
          user.out[2].should.have.properties({randoId: "6", report: 0, delete: 0, rating: 5});
          done();
        });
      });
    });
  });

  describe("Queries projection. ", function() {
    beforeEach( done => {
      var fullUser = {
        email: "user@rando4.me",
        authToken: "authToken",
        facebookId: "facebookId",
        googleId: "googleId",
        anonymousId: "anonymousId",
        password: "password",
        ban: 123,
        ip: "ip",
        firebaseInstanceIds: [{
          instanceId: "instanceId",
          active: 123,
          createdDate: 123,
          lastUsedDate: 123
        }],
        report: [{
          reportedBy: "user1@rando4.me",
          reason: "reason",
          reportedDate: 123,
          randoId: "randoId"
        }],
        in: [{
          email: "user@rando4.me",
          randoId: "123",
          originalFileName: "originalFileName",
          chosenRandoId: "chosenRandoId",
          strangerRandoId: "strangerRandoId",
          creation: 123,
          ip: "ip",
          location: {
            latitude: 123,
            longitude: 123
          },
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          mapURL: "mapURL",
          mapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          strangerMapURL: "strangerMapURL",
          strangerMapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          tags: ["tag1"],
          delete: 123,
          report: 123,
          rating: 123
        }],
        out: [{
          email: "user1@rando4.me",
          randoId: "randoId",
          originalFileName: "originalFileName",
          chosenRandoId: "chosenRandoId",
          strangerRandoId: "strangerRandoId",
          creation: 123,
          ip: "ip",
          location: {
            latitude: 123,
            longitude: 123
          },
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          mapURL: "mapURL",
          mapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          strangerMapURL: "strangerMapURL",
          strangerMapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          tags: ["tag1"],
          delete: 123,
          report: 123,
          rating: 123
        }]
      };

      db.user.create(fullUser, done);
    });

    it("Should get all filds in getLightUserWithInAndOutByEmail", done => {
      db.user.getLightUserWithInAndOutByEmail("user@rando4.me", (err, user) => {
        should.not.exist(err);
        user.should.have.properties({
          email: "user@rando4.me",
          authToken: "authToken",
          ban: 123,
          ip: "ip"
        });

        user.firebaseInstanceIds[0].should.have.properties({
          instanceId: "instanceId",
          active: 123,
          createdDate: 123,
          lastUsedDate: 123
        });

        user.should.not.have.property("report");

        user.in[0].should.have.properties({
          email: "user@rando4.me",
          randoId: "123",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          mapURL: "mapURL",
          mapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          delete: 123,
          report: 123,
          rating: 123
        });

        user.out[0].should.have.properties({
          email: "user1@rando4.me",
          randoId: "randoId",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          strangerMapURL: "strangerMapURL",
          strangerMapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          tags: ["tag1"],
          delete: 123,
          report: 123,
          rating: 123
        });
        done();
      });
    });

    it("Should get all filds in getAllLightInAndOutRandosByEmail", done => {
      db.user.getAllLightInAndOutRandosByEmail("user@rando4.me", (err, user) => {
        should.not.exist(err);
        user.should.not.have.property("email");
        user.should.not.have.property("authToken");
        user.should.not.have.property("facebookId");
        user.should.not.have.property("googleId");
        user.should.not.have.property("anonymousId");
        user.should.not.have.property("password");
        user.should.not.have.property("ban");
        user.should.not.have.property("ip");
        user.should.not.have.property("firebaseInstanceIds");
        user.should.not.have.property("report");

        user.in[0].should.have.properties({
          randoId: "123",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          mapURL: "mapURL",
          mapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          delete: 123,
          report: 123,
          rating: 123
        });

        user.out[0].should.have.properties({
          randoId: "randoId",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          strangerMapURL: "strangerMapURL",
          strangerMapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          tags: ["tag1"],
          delete: 123,
          report: 123,
          rating: 123
        });
        done();
      });
    });

    it("Should get all filds in getLightUserWithInAndOutByEmail", done => {
      db.user.getLightUserWithInAndOutByEmail("user@rando4.me", (err, user) => {
        should.not.exist(err);
        user.should.have.properties({
          email: "user@rando4.me",
          authToken: "authToken",
          ban: 123,
          ip: "ip"
        });

        user.firebaseInstanceIds[0].should.have.properties({
          instanceId: "instanceId",
          active: 123,
          createdDate: 123,
          lastUsedDate: 123
        });

        user.should.not.have.property("report");

        user.in[0].should.have.properties({
          email: "user@rando4.me",
          randoId: "123",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          mapURL: "mapURL",
          mapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          delete: 123,
          report: 123,
          rating: 123
        });

        user.out[0].should.have.properties({
          email: "user1@rando4.me",
          randoId: "randoId",
          creation: 123,
          imageURL: "imageURL",
          imageSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          strangerMapURL: "strangerMapURL",
          strangerMapSizeURL: {
            small: "small",
            medium: "medium",
            large: "large"
          },
          tags: ["tag1"],
          delete: 123,
          report: 123,
          rating: 123
        });
        done();
      });
    });

  });
});
