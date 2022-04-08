const mongoose = require("mongoose");
const Joi = require("joi");
//schema and validation for post genre
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
    trim: true,
  },
});
function genreInputValidation(input) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(input);
}

//model for genres collection
const Genre = mongoose.model("genres", genreSchema);
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.genreInputValidation = genreInputValidation;
