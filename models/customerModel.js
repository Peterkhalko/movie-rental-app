const mongoose = require("mongoose");
const Joi = require("joi");

//schema for customer model
const customerSchema = mongoose.Schema({
  name: {
    type: String,
    min: 5,
    max: 50,
    required: true,
  },
  phone: {
    type: String,
    min: 9,
    max: 10,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});
//model for customer collection
const Customer = mongoose.model("customer", customerSchema);

function customerInputValidation(input) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(9).max(10),
    isGold: Joi.boolean().default(false),
  });
  return schema.validate(input);
}
function customerInputValidationPATCH(input) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50),
    phone: Joi.string().min(9).max(10),
    isGold: Joi.boolean().default(false),
  });
  return schema.validate(input);
}

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.customerInputValidation = customerInputValidation;
module.exports.customerInputValidationPATCH = customerInputValidationPATCH;
