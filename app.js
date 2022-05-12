const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

if (process.env.NODE_ENV != "test") {
  require("./startup/port")(app);
}

module.exports = app;
