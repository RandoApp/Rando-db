var should = require("should");
var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");

describe("User.", function () {
  beforeEach(function (done) {
    db.connect(config.test.db.url, function () {
      db.user.removeAll(done);
    });
  });

  it("Should contains metric modules in metrics array", function (done) {
    db.user.create({}, function () {
      db.user.getAll(function (err, users) {
        users.should.have.length(1);
        done();
      });
    })
  });
});
