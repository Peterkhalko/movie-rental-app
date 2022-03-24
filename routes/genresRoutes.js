const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Genre, genreInputValidation } = require("../models/genreModel");

//get API
router.get("/", auth, async (req, res) => {
  try {
    const genres = await Genre.find({});
    if (genres.length == 0) {
      return res.status(400).send("Data not found");
    }
    res.send(genres);
  } catch (error) {
    res.sendStatus(404).send(error);
  }
});
//getById API
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const genre = await Genre.findById({ _id });
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  } catch (error) {
    res.status(404).send(error);
  }
});

//post API
router.post("/", async (req, res) => {
  try {
    const { error } = genreInputValidation(req.body);
    if (error) {
      throw error.details[0].message;
    }
    const genre = new Genre({
      name: req.body.name,
    });
    await genre.save();
    res.send(genre);
  } catch (error) {
    res.status(409).send(error.message || error);
  }
});

//Put API
router.put("/:id", async (req, res) => {
  try {
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
      throw "_id not found to update the data";
    }
    res.send(genre);
  } catch (error) {
    res.status(404).send(error.message || error);
  }
});
// router.patch("/:id", (req, res) => {
//   const id = req.params.id;
//   const genreExists = genres.find((e) => e.id === parseInt(id));
//   if (!genreExists) {
//     return res.status(404).send("genre not found to Patch");
//   }
//   const { error } = genreInputValidation(req.body);
//   if (error) {
//     console.log("error", error.details[0].message);
//     return res.status(400).send(error.details[0].message);
//   }
//   genreExists.name = req.body.name;
//   res.send(genreExists);
// });
//Delete API
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const genre = await Genre.findByIdAndDelete(id);
    if (!genre) {
      throw "_id not found to delete";
    }
    res.send(genre);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
