const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genreModel");
const {
  Movie,
  movieSchema,
  movieInputValidation,
} = require("../models/movieModel");
const { append } = require("express/lib/response");
const req = require("express/lib/request");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find({});
    if (!movies) {
      return res.status("404").send("No data found");
    }
    console.log(movies);
    res.send(movies);
  } catch (error) {
    res.send(error);
  }
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const movie = await Movie.findById({ _id });
    if (!movie) return res.status(404).send("movie not found");
    res.send(movie);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  const { error } = movieInputValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Please check genreId");
  try {
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
    console.log(movie);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
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
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    res.send(movie);
    if (!movie) {
      return res.status(400).send("movie not found to delete");
    }
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = router;
