const mongoose = require("mongoose");
const { movieSchema } = require("./movieModel");
const { customerSchema } = require("./customerModel");
const Joi = require("joi");
const { number, date } = require("joi");
const rentalSchema = new mongoose.Schema({
  customer: new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    phone: {
      type: String,
      required: true,
      minLength: 7,
      maxLength: 10,
    },
  }),
  movie: {
    required: true,
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 225,
      },
    }),
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateIn: {
    type: Date,
    default: null,
  },
  rentalFee: {
    type: Number,
    min: 0,
    max: 10000,
    required: true,
  },
});

function rentalInputValidation(input) {
  const schema = Joi.object({
    customer: Joi.objectId().required(),
    movie: Joi.objectId().required(),
  });
  return schema.validate(input);
}
const Rentals = mongoose.model("rentals", rentalSchema);
module.exports.rentalSchema = rentalSchema;
module.exports.Rentals = Rentals;
module.exports.rentalInputValidation = rentalInputValidation;
