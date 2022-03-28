const config = require("config");
module.exports = function () {
  if (!config.get("private_key")) {
    console.log("FATAL error");
    process.exit(1);
  }
};
