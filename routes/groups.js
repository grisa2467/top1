const express = require("express");
const db = require("../models");
const auth = require("../middleware/auth");
const router = express.Router();
const Group = db.sequelize.models.Group;
const User = db.sequelize.models.User;

router.get("/", auth, async (req, res) => {
  const allGroups = await Group.findAll();
  res.status(200).json({ groups: allGroups });
});

router.get("/agents", auth, async (req, res) => {
  const groupId = +req.query.groupId;
  if (!groupId) {
    return res.status(400).json({ err: "Bad request. Add groupId param." });
  }
  const group = await Group.findByPk(groupId, {
    include: [
      {
        model: User,
        as: "users",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json({ group });
});

router.post("/", auth, async (req, res) => {
  const { name, e999Token } = req.body;

  if (!(name && e999Token)) {
    return res.status(400).json({ err: "Please enter all fields" });
  }
  const newGroup = await Group.create({
    name,
    e999Token,
  });

  res.status(200).json({ id: newGroup.dataValues.id });
});
module.exports = router;
