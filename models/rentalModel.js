const mongoose = require("mongoose");
const Joi = require("joi");
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
        max: 10,
      },
    }),
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateIn: Date,
  rentalFee: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
});
const Rentals = mongoose.model("rentals", rentalSchema);
module.exports.rentalSchema = rentalSchema;
module.exports.Rentals = Rentals;
