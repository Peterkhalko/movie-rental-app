const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
app.use(express.json());
const port = process.env.PORT || 8000;
const genresRouter = require("./routes/genresRoutes");
app.use("/api/genres", genresRouter);
mongoose
  .connect(config.get("DB_CONNECTION_URL"))
  .then((db) => {
    console.log(`connected to ${config.get("DB_CONNECTION_URL")} db`);
  })
  .catch((error) => {
    console.log(error);
  });
app.listen(port, () => {
  console.log(`Server is up and runnig! ${port}`);
});