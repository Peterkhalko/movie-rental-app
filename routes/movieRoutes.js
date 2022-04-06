const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genreModel");
const auth = require("../middleware/auth");
const {
  Movie,
  movieSchema,
  movieInputValidation,
} = require("../models/movieModel");
const { append } = require("express/lib/response");
const req = require("express/lib/request");
const adminAuth = require("../middleware/adminAuth");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const movies = await Movie.find({});
  if (movies && movies.length == 0) {
    return res.status("404").send("No data found");
  }
  res.send(movies);
});
router.get("/:id", validateObjectId, async (req, res) => {
  const _id = req.params.id;
  const movie = await Movie.findById({ _id });
  if (!movie) return res.status(404).send("movie not found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = movieInputValidation(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Please check genreId");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      name: genre.name,
      _id: genre._id,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStocks: req.body.numberInStocks,
  });
  await movie.save();
  res.send(movie);
});

router.put("/:id", validateObjectId, auth, async (req, res) => {
  const _id = req.params.id;
  const { error } = movieInputValidation(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Please check genreId");
  const movie = await Movie.findByIdAndUpdate(
    _id,
    {
      $set: {
        title: req.body.title,
        genre: {
          name: genre.name,
          _id: genre._id,
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStocks: req.body.numberInStocks,
      },
    },
    { new: true }
  );
  if (!movie) {
    return res.send("movie not found to update");
  }
  res.send(movie);
});
router.delete("/:id", validateObjectId, auth, adminAuth, async (req, res) => {
  const _id = req.params.id;
  const movie = await Movie.findByIdAndDelete(_id);
  if (!movie) {
    return res.status(400).send("movie not found to delete");
  }
  res.send(movie);
});
module.exports = router;
