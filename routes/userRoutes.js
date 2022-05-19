const express = require("express");
const res = require("express/lib/response");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { Users, userInputValidation } = require("../models/userModel");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const validateObjectId = require("../middleware/validateObjectId");
const { sendWelcomeEmail } = require("../emails/account");
router.get("/", async (req, res) => {
  const users = await Users.find();
  if (!users || users.length == 0) {
    res.status(404).send("no user found");
  }
  res.send(users);
});
router.get("/:id", validateObjectId, async (req, res) => {
  const _id = req.params.id;
  const user = await Users.findById({ _id });
  if (!user || user.length == 0) {
    res.status(404).send("no user found");
  }
  res.send(user);
});
router.post("/", async (req, res) => {
  const { error } = userInputValidation(req.body);
  if (error) {
    return res.status(400).send(`${error.details[0].message}`);
  }
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    return res.status(409).send("Email already exists");
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
      //sendWelcomeEmail(user.email, user.name);
    });
  });
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  if (!user || user.length == 0) {
    res.status(404).send("user not found");
  }
  res.send(user);
});
module.exports = router;
