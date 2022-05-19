const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  Customer,
  customerInputValidation,
  customerInputValidationPATCH,
} = require("../models/customerModel");
const adminAuth = require("../middleware/adminAuth");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  if (customers.length == 0) {
    return res.status("404").send("No data found");
  }
  res.send(customers);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const _id = req.params.id;
  const customer = await Customer.findById({ _id });
  if (!customer) return res.status(404).send("customer not found");
  res.send(customer);
});
router.post("/", auth, async (req, res) => {
  const { error } = customerInputValidation(req.body);
  if (error) {
    throw error.details[0].message;
  }
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", validateObjectId, auth, async (req, res) => {
  const id = req.params.id;
  const { error } = customerInputValidation(req.body);
  if (error) {
    throw error.details[0].message;
  }
  const customer = await Customer.findByIdAndUpdate(
    id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );
  if (!customer) {
    throw "_id not found to update the data";
  }
  res.send(customer);
});
// router.patch("/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { error } = customerInputValidationPATCH(req.body);
//     if (error) {
//
//       throw error.details[0].message;
//     }
//     const customer = await Customer.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           name: req.body.name,
//           phone: req.body.phone,
//           isGold: req.body.isGold,
//         },
//       },
//       { new: true }
//     );
//     if (!customer) {
//       throw "_id not found to update the data";
//     }
//     res.send(customer);
//   } catch (error) {
//     res.status(404).send(error.message || error);
//   }
// });

router.delete("/:id", validateObjectId, auth, adminAuth, async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    throw "_id not found to delete";
  }
  res.send(customer);
});

module.exports = router;
