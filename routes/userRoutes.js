const express = require("express");
const res = require("express/lib/response");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { Users, userInputValidation } = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const users = await Users.find({});
    if (!users) {
      res.send("no user found");
    }
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Users.findById({ _id });
    if (!user) {
      return res.send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const { error } = userInputValidation(req.body);
    if (error) {
      return res.status(404).send(`${error.details[0].message}`);
    }
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("Email already exists");
    }
    bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        if (err) {
          res.send("Unable to has the passoword please contact admin");
        }
        user = new Users({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          isAdmin: req.body.isAdmin,
        });
        await user.save();
        res.send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
      });
    });
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      res.send("user not found");
    }
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
