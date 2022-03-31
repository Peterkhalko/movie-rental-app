const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Users } = require("../models/userModel");
const jwt = require("jsonwebtoken");
router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send("invalid email or passowrd joi format");
  }
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("user with this email does not exist");
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).send("user password did not match");
  }
  const token = user.getAuthToken();
  res.send(` ${token}`);
});
function validateLogin(input) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(30).required(),
  });
  return schema.validate(input);
}
module.exports = router;
