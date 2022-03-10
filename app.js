const express = require("express");
const req = require("express/lib/request");
const Joi = require("joi");
const app = express();
app.use(express.json());
const port = 8000;
let genres = [
  { id: 1, name: "romance" },
  {
    id: 2,
    name: "city light",
  },
];
app.get("/api/genres", (req, res) => {
  res.send(genres);
});
app.post("/api/genres", (req, res) => {
  const genreExists = genres.find((e) => e.name === req.body.name);
  if (genreExists) {
    return res.status(404).send("Movie alredy exists");
  }
  const { error } = movieInputValidation(req.body);
  if (error) {
    console.log("error", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  const newGenre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(newGenre);
  res.send(newGenre);
});

app.put("/api/genres/:id", (req, res) => {
  const id = req.params.id;
  const genreExists = genres.find((e) => e.id === parseInt(id));
  if (!genreExists) {
    return res.status(404).send("movie not found to update");
  }
  const { error } = movieInputValidation(req.body);
  if (error) {
    console.log("error", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  genreExists.name = req.body.name;
  res.send(genreExists);
});
app.patch("/api/genres/:id", (req, res) => {
  const id = req.params.id;
  const genreExists = genres.find((e) => e.id === parseInt(id));
  if (!genreExists) {
    return res.status(404).send("movie not found to Patch");
  }
  const { error } = movieInputValidation(req.body);
  if (error) {
    console.log("error", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  genreExists.name = req.body.name;
  res.send(genreExists);
});
app.delete("/api/genres/:id", (req, res) => {
  const id = req.params.id;
  const genreExists = genres.find((e) => e.id === parseInt(id));
  if (!genreExists) {
    return res.status(404).send("movie not found to update");
  }
  let deletingIndex = genres.indexOf(genreExists);
  genres.splice(deletingIndex, 1);
  res.send(genreExists);
  console.log("genres after deletion: ", genres);
});

function movieInputValidation(input) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(input);
}

app.listen(port, () => {
  console.log(`Server is up and runnig! ${port}`);
});
