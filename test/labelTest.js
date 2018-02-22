var config = require("config");
var db = require("../lib/randoDB");
var should = require("should");

describe("db.label.", () => {

  before((done) => {
    db.connect(config.test.db.url, done);
  });

  after((done) => {
    db.disconnect(done);
  });

  afterEach((done) => {
    db.label.removeAll(done);
  });

  describe("save", () => {
    it("Should save new label and save all fields", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      }, () => {
        db.label.getByRandoId("randoIdValue", (err, label) => {
          should.not.exist(err);
          label.email.should.be.eql("email_1@gm.com");
          label.randoId.should.be.eql("randoIdValue");
          label.randoUrl.should.be.eql("randoUrlValue");
          label.labels.should.be.eql(["lab1", "lab2"]);
          done();
        });
      });
    });

    it("Should save and then update existing label by randoId", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      }, () => {
        db.label.getByRandoId("randoIdValue", (err, label) => {
          should.not.exist(err);
          label.email.should.be.eql("email_1@gm.com");
          label.randoId.should.be.eql("randoIdValue");
          label.randoUrl.should.be.eql("randoUrlValue");
          label.labels.should.be.eql(["lab1", "lab2"]);
          db.label.save({
            "email": "new_email@gm.com",
            "randoId": "randoIdValue",
            "randoUrl": "new_randoUrlValue",
            "labels": ["lab1", "lab3", "lab5"]
          }, () => {
            db.label.getByRandoId("randoIdValue", (err, label) => {
              should.not.exist(err);
              label.email.should.be.eql("new_email@gm.com");
              label.randoId.should.be.eql("randoIdValue");
              label.randoUrl.should.be.eql("new_randoUrlValue");
              label.labels.should.be.eql(["lab1", "lab3", "lab5"]);
              done();
            });
          });
        });
      });
    });

    it("Should save label and not fail when callback is not specified", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      });
      done();
    });


  });

  describe("getByRandoId", () => {
    it("Should save label and get it by randoId", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      }, () => {
        db.label.getByRandoId("randoIdValue", (err, label) => {
          should.not.exist(err);
          should.exist(label);
          label.email.should.be.eql("email_1@gm.com");
          label.randoId.should.be.eql("randoIdValue");
          label.randoUrl.should.be.eql("randoUrlValue");
          label.labels.should.be.eql(["lab1", "lab2"]);
          done();
        });
      });
    });

    it("Should get nothing when there is no such label by randoId", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      }, () => {
        db.label.getByRandoId("not_existing_randoIdValue", (err, label) => {
          should.not.exist(err);
          should.not.exist(label);
          done();
        });
      });
    });

    it("Should get nothing when db is empty", (done) => {
      db.label.save({
        "email": "email_1@gm.com",
        "randoId": "randoIdValue",
        "randoUrl": "randoUrlValue",
        "labels": ["lab1", "lab2"]
      }, () => {
        db.label.getByRandoId("not_existing_randoIdValue", (err, label) => {
          should.not.exist(err);
          should.not.exist(label);
          done();
        });
      });
    });

    describe("getAllLightByLabel", () => {
      it("Should getAllLight by label when label is null", (done) => {
        db.label.save({
          "email": "email_1@gm.com",
          "randoId": "randoIdValue",
          "randoUrl": "randoUrlValue",
          "labels": ["lab1", "lab2"]
        }, () => {
          db.label.getAllLightByLabel("lab1", (err, labels) => {
            should.not.exist(err);
            labels.should.have.length(1);
            var label = labels[0];
            label.email.should.be.eql("email_1@gm.com");
            label.randoId.should.be.eql("randoIdValue");
            label.randoUrl.should.be.eql("randoUrlValue");
            label.labels.should.be.eql(["lab1", "lab2"]);
            done();
          });
        });
      });

      it("Should getAllLight by label when label is null", (done) => {
        db.label.save({
          "email": "email_1@gm.com",
          "randoId": "randoIdValue",
          "randoUrl": "randoUrlValue",
          "labels": ["lab1", "lab2"]
        }, () => {
          db.label.getAllLightByLabel(null, (err, labels) => {
            should.not.exist(err);
            labels.should.have.length(1);
            var label = labels[0];
            label.email.should.be.eql("email_1@gm.com");
            label.randoId.should.be.eql("randoIdValue");
            label.randoUrl.should.be.eql("randoUrlValue");
            label.labels.should.be.eql(["lab1", "lab2"]);
            done();
          });
        });
      });
    });
  });
});
