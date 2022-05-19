const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { Genre, genreInputValidation } = require("../models/genreModel");

router.get("/", async (req, res) => {
  const genres = await Genre.find({});
  if (genres.length == 0) {
    return res.status(404).send("Data not found");
  }
  res.send(genres);
});
//getById API
router.get("/:id", validateObjectId, async (req, res) => {
  const _id = req.params.id;
  const genre = await Genre.findById({ _id });
  if (!genre) return res.status(400).send("Genre not found");
  res.send(genre);
});

//post API
router.post("/", auth, async (req, res) => {
  const { error } = genreInputValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

//Put API
router.put("/:id", validateObjectId, auth, async (req, res) => {
  const id = req.params.id;
  const { error } = genreInputValidation(req.body);
  if (error) {
    throw error.details[0].message;
  }
  const genre = await Genre.findByIdAndUpdate(
    id,
    { $set: { name: req.body.name } },
    { new: true }
  );
  if (!genre) {
    throw { message: "_id not found to update the data" };
  }
  res.send(genre);
});
// router.patch("/:id", (req, res) => {
//   const id = req.params.id;
//   const genreExists = genres.find((e) => e.id === parseInt(id));
//   if (!genreExists) {
//     return res.status(404).send("genre not found to Patch");
//   }
//   const { error } = genreInputValidation(req.body);
//   if (error) {
//
//     return res.status(400).send(error.details[0].message);
//   }
//   genreExists.name = req.body.name;
//   res.send(genreExists);
// });
//Delete API
router.delete("/:id", auth, adminAuth, validateObjectId, async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) {
    throw { message: "_id not found to delete the data" };
  }
  res.send(genre);
});

module.exports = router;
