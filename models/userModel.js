const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const { string, boolean } = require("joi");
require("mongoose-type-email");
const joi = require("joi");
const { joiPassword } = require("joi-password");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 5,
    max: 255,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
  },
  password: {
    type: String,
    min: 5,
    max: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
function userInputValidation(input) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(1).max(100).email().required(),
    password: joiPassword
      .string()
      // .minOfSpecialCharacters(2)
      // .minOfLowercase(2)
      // .minOfUppercase(2)
      // .minOfNumeric(2)
      // .noWhiteSpaces()
      // .required()
      .min(5)
      .max(255),
    isAdmin: Joi.boolean().default(false),
  });
  return schema.validate(input);
}

const Users = mongoose.model("users", userSchema);
module.exports.userInputValidation = userInputValidation;
module.exports.Users = Users;