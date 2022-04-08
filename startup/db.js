const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  mongoose
    .connect(config.get("DB_CONNECTION_URL"))
    .then((db) => {
      // console.log(`connected to ${config.get("DB_CONNECTION_URL")} db`);
    })
    .catch((error) => {
      console.log(error);
    });
};
