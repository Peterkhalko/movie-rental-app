const express = require("express");
const router = express.Router();
const { Rentals, rentalInputValidation } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
router.get("/", (req, res) => {
  res.send("hello from rentals");
});
router.post("/", async (req, res) => {
  try {
    const { error } = rentalInputValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const movie = await Movie.findById(req.body.movie);
    const customer = await Customer.findById(req.body.customer);
    if (!movie || !customer) {
      return res.status(400).send("movie or customer not found");
    }
    const rental = new Rentals({
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      rentalFee: movie.dailyRentalRate * 10,
    });
    console.log(movie);
    await rental.save();
    res.send(rental);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", (req, res) => {});
module.exports = router;
