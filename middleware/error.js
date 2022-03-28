const winston = require("winston");
module.exports = function (error, req, res, next) {
  winston.error(error.message);
  res.status(400).send(`Somthing went wrong, ${error.message}`);
};
