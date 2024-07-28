const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = new express.Router();
const SECRET = "secret";

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ user: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error();
    }
    const token = jwt.sign({ _id: user._id }, SECRET);
    res.send({ user, token });
  } catch (error) {
    res.send(400).send({ error: "Login failed!" });
  }
});

module.exports = router;
