const express = require("express");
const router = express.Router();
const {
  Customer,
  customerInputValidation,
  customerInputValidationPATCH,
} = require("../models/customerModel");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({});
    if (customers.length == 0) {
      return res.status("404").send("No data found");
    }
    res.send(customers);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const customer = await Customer.findById({ _id });
    if (!customer) return res.status(404).send("customer not found");
    res.send(customer);
  } catch (error) {
    res.status(404).send(error);
  }
});
router.post("/", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(409).send(error.message || error);
  }
});

router.put("/:id", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).send(error.message || error);
  }
});
// router.patch("/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { error } = customerInputValidationPATCH(req.body);
//     if (error) {
//         console.log("in the erro");
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      throw "_id not found to delete";
    }
    res.send(customer);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
