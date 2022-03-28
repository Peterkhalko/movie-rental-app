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
