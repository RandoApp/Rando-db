const config = require("config");
const db = require("../lib/randoDB");
const should = require("should");

describe("randoDB.", () => {
  it("Should connect successfully and callback without error and disconnect", (done) => {
    db.connect(config.test.db.url, err => {
      should.not.exist(err);
      db.user.getAll(function(err, users) {
        should.not.exist(err);
        users.should.have.length(0);
        db.disconnect(done);
      });
    });
  });
  it("Should Not connect and callback with error when bad url passed", function (done) {
    this.timeout(55000);
    db.connect("mongodb://NOT_A_MONGO_URL", err => {
      should.exist(err);
      done();
    });
  });
});
