const winston = require("winston");
require("express-async-errors");
module.exports = function () {
  winston.configure({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logfile.log" }),
    ],
  });
};

process.on("uncaughtException", (exception) => {
  winston.error("we got an uncaght exception", +exception.message);
  process.exit(1);
});
process.on("unhandledRejection", (exception) => {
  winston.error("we got an unhandled rejection exception", +exception.message);
  process.exit(1);
});
