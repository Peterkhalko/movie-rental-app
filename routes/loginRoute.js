const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Users } = require("../models/userModel");
router.post("/", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    res.send("user with this email does not exist");
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.send("user password did not match");
  }
  res.send(`user password matched ${user.password}`);
});

module.exports = router;
