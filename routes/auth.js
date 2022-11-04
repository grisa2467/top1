const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");

const router = express.Router();
const User = db.sequelize.models.User;

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!(username && password)) {
    return res.status(400).json({ err: "Please enter all fields" });
  }

  //Check for existing user
  const existingUsers = await User.findAll({
    where: {
      username,
    },
  });
  if (!existingUsers.length) {
    return res.status(400).json({ err: "User does not exist" });
  }
  const user = existingUsers[0];
  const passwordIsCorrect = bcrypt.compareSync(password, user.password);
  if (!passwordIsCorrect)
    return res.status(400).json({ err: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 54000,
  });

  res.status(200).json({ token });
});
module.exports = router;
