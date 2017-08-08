var sinon = require("sinon");
var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");
var async = require("async");
var shell = require("shelljs");

describe("db.status", () => {

  before(done => {
    db.connect(config.test.db.url,done);
  });

  after(done => {
    db.disconnect(done);
  });

  it("Status should contains ok = 1", done => {
    db.status((err, status) => {
      status.should.containEql('"ok" : 1');
      done();
    });
  });

  it("Should fail", done => {
    sinon.stub(shell, "exec", function (command, options, callback) {
      callback(1);
    });

    db.status((err, status) => {
      err.should.have.property("message", "db.status fail. Code: 1");
      shell.exec.restore();
      done();
    });
  });
});
