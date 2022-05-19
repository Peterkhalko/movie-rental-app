const config = require("config");
module.exports = function () {
  if (!config.get("private_key")) {
    process.exit(1);
  }
};
