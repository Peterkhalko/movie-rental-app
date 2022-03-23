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
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
function userInputValidation(input) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(2)
      .minOfLowercase(2)
      .minOfUppercase(2)
      .minOfNumeric(2)
      .noWhiteSpaces()
      .required(),
    isAdmin: Joi.boolean().default(false),
  });
  return schema.validate(input);
}

const Users = mongoose.model("users", userSchema);
module.exports.userInputValidation = userInputValidation;
module.exports.Users = Users;
