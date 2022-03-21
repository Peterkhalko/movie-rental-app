const express = require("express");
const router = express.Router();
const { Rentals } = require("../models/rentalModel");
router.get("/", (req, res) => {
  console.log("roter get");
  res.send("hello from rentals");
});

module.exports = router;
