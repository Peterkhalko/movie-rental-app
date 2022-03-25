const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
app.use(express.json());
const port = process.env.PORT || 8000;
const genresRouter = require("./routes/genresRoutes");
const customerRouter = require("./routes/customerRoutes");
const movieRouter = require("./routes/movieRoutes");
const rentalRouter = require("./routes/rentalRoutes");
const userRouter = require("./routes/userRoutes");
const loginRouter = require("./routes/loginRoute");
app.use("/api/genres", genresRouter);
app.use("/api/customers", customerRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
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
