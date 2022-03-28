const express = require("express");
const app = express();
const config = require("config");
const port = process.env.PORT || 8000;
require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

app.listen(port, () => {
  console.log(`Server is up and runnig! ${port}`);
});
