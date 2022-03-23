const express = require("express");
const router = express.Router();
const { Rentals, rentalInputValidation } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
router.get("/", async (req, res) => {
  const rental = await Movie.find({});
  if (!rental) {
    return res.status(400).send("unable to find");
  }
  res.send(rental);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const rental = await Rentals.findById({ _id });
  if (!rental) {
    return res.status(400).send("unable to find");
  }
  console.log(rental);
  res.send(rental);
});
router.post("/", async (req, res) => {
  try {
    const { error } = rentalInputValidation(req.body);
    if (error) {
      return res.status(404).send(error.details[0].message);
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
    await rental.save();
    res.send(rental);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const rental = await Rentals.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          dateIn: Date.now(),
        },
      },
      { new: true }
    );
    res.send(rental);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rentals.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res.status("404").send("Rental details not found to delete");
    }
    res.send(rental);
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
