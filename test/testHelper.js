var db = require("../lib/randoDB");
var config = require("config");

module.exports = {
  isConnectionToDBEstablished: false,
  connectToDBOnce (callback) {
    if (!this.isConnectionToDBEstablished) {
      this.isConnectionToDBEstablished = true;
      db.connect(config.test.db.url, callback);
    } else {
      callback();
    }
  }
};
