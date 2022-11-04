const express = require("express");
const db = require("../models");
const auth = require("../middleware/auth");

const router = express.Router();
const SiteInfo = db.sequelize.models.SiteInfo;

router.get("/", async (req, res) => {
  console.log(req.query.fields);
  if (!req.query.fields) return res.status(400).json({ err: "Bad request!" });
  try {
    const data = JSON.parse(decodeURIComponent(req.query.fields));
    console.log(data.fields);
    const info = await SiteInfo.findAll({
      where: {
        id: data.fields,
      },
    });

    res.status(200).json({ info });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

router.patch("/", auth, async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));

  // for (let i = 0; i < Object.entries(obj).length; i++) {
  //   const [id, description] = Object.entries(obj)[i];
  //   console.log(element);
  // }
  try {
    const requests = Object.entries(obj).map(([id, description]) =>
      SiteInfo.update({ description }, { where: { id } })
    );

    const responses = await Promise.all(requests);
    console.log(responses);
    res.status(200).json({ msg: "updated" });
  } catch (err) {
    res.status(400).json({ err });
  }
});
module.exports = router;
