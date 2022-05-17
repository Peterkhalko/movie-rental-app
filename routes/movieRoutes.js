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
    liked: req.body.liked,
  });
  await movie.save();
  res.send(movie);
});
//pagination route
router.post("/pfs", async (req, res) => {
  let args = {};
  let sortArgs = {};
  if (req.body.genre && req.body.genre != "all genre") {
    args["genre.name"] = req.body.genre;
  }
  if (req.body.title) {
    args["title"] = new RegExp(`^${req.body.title}`, "i");
  }
  if (req.body.sort) {
    sort = req.body.sort;
    itemToSort = req.body.itemToSort;
    sortArgs[itemToSort] = sort;
  }

  const movies = await Movie.find(args)
    .sort(sortArgs)
    .limit(5)
    .skip(req.body.skip);

  res.send(movies);
});
//moviesCount route
router.get("/count/movies", async (req, res) => {
  const { genreName } = req.query;
  let query = {};
  let isTitleSearch = false;
  if (genreName.substring(0, 11) == "titleSearch") {
    query["title"] = new RegExp(
      `^${genreName.substring(11, genreName.length)}`,
      "i"
    );

    isTitleSearch = true;
  }

  if (
    (!isTitleSearch && genreName && genreName != "all genre") ||
    genreName == undefined
  ) {
    query["genre.name"] = genreName;
  }
  const moviesCount = await Movie.find(query).count();
  res.send({ count: moviesCount });
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
        liked: req.body.liked,
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
