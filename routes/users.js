const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const multer = require("multer");
const FormData = require("form-data");
const path = require("path");
const http = require("https");
const { unlinkSync, createReadStream } = require("fs");

const router = express.Router();
const User = db.sequelize.models.User;
const Group = db.sequelize.models.Group;

const storage = multer.diskStorage({
  destination: "./tmp",
  filename: (req, file, cb) => {
    const fileSplit = file.originalname.split(".");
    const ext = fileSplit[fileSplit.length - 1];
    const newFilename =
      "" + Date.now() + crypto.randomBytes(8).toString("hex") + "." + ext;
    cb(null, newFilename);
  },
});
const upload = multer({ storage });

//Private
//@path     /api/users/all
router.get("/all", auth, async (req, res) => {
  const response = await User.findAll();

  res.status(200).json({ users: response });
});

router.get("/agentProfile/:id", async (req, res) => {
  const { id: userId } = req.params;
  if (!userId)
    return res.status(400).json({ err: "Bad request. No Agent ID." });
  const response = await User.findByPk(userId, {
    attributes: {
      exclude: ["password", "e999Token", "createdAt", "updatedAt"],
    },
  });

  res.status(200).json({ profile: response });
});

router.get("/profile", auth, async (req, res) => {
  const userId = req.query.id || req.user.id;
  const response = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  res.status(200).json({ profile: response });
});

router.patch("/update", auth, upload.single("image"), async (req, res) => {
  const { givenName, familyName, e999Token, tel, deleteImage } = req.body;
  const userId = req.body.userId || req.user.id;
  const columnsToUpdate = {};
  if (givenName) columnsToUpdate.givenName = givenName;
  if (familyName) columnsToUpdate.familyName = familyName;
  // if (e999Token) columnsToUpdate.e999Token = e999Token;
  if (tel) columnsToUpdate.tel = tel;
  console.log(req.body);
  const file = req.file;
  let photoId = null;
  if (file) {
    const encodedApi = Buffer.from(`${e999Token}:`).toString("base64");

    const getPhoto999Id = async (file, cb) => {
      const reqPhotoPromise = new Promise((resolve, reject) => {
        const formData = new FormData();
        const fileLocation = path.join(file.destination, file.filename);
        const readStream = createReadStream(fileLocation);
        formData.append("file", readStream);
        const headers = {
          ...formData.getHeaders(),
          Authorization: `Basic ${encodedApi}`,
        };
        const options = {
          host: `partners-api.999.md`,
          path: "/images",
          port: 443,
          method: "POST",
          headers,
        };
        const postReq = http
          .request(options, (res) => {
            let total = "";
            res.on("data", (d) => {
              total += d;
            });
            res.on("end", () => {
              resolve(JSON.parse(total));
            });
          })
          .on("error", (e) => {
            console.log(e);
            reject(e);
          });
        formData.pipe(postReq);
      });

      const promiseResponse = await reqPhotoPromise;
      console.log(promiseResponse);
      cb(promiseResponse.image_id);
    };

    await getPhoto999Id(file, (imageId) => {
      photoId = imageId.split("?")[0];
    });

    try {
      unlinkSync(file.path);
    } catch (err) {
      console.log(err);
    }
  }
  if (photoId) columnsToUpdate.image = photoId;
  if (deleteImage) columnsToUpdate.image = null;
  try {
    const response = await User.update(columnsToUpdate, {
      where: {
        id: userId,
      },
    });
    res.status(200).json({ msg: response });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  // if (req.user.id !== 1) return res.status(401).json({ err: "Unauthorized" });
  const { username, givenName, familyName, groupId, tel } = req.body;
  const file = req.file;
  //Validation
  if (!(username && givenName && familyName && groupId && tel)) {
    return res.status(400).json({ err: "Please enter all fields" });
  }

  //Check for existing user
  const existingUsers = await User.findAll({
    where: {
      username,
    },
  });
  if (existingUsers.length) {
    return res.status(400).json({ err: "Username already exists" });
  }

  const e999Token = (await Group.findByPk(groupId)).dataValues.e999Token;
  let photoId = null;
  if (file) {
    const encodedApi = Buffer.from(`${e999Token}:`).toString("base64");

    const getPhoto999Id = async (file, cb) => {
      const reqPhotoPromise = new Promise((resolve, reject) => {
        const formData = new FormData();
        const fileLocation = path.join(file.destination, file.filename);
        const readStream = createReadStream(fileLocation);
        formData.append("file", readStream);
        const headers = {
          ...formData.getHeaders(),
          Authorization: `Basic ${encodedApi}`,
        };
        const options = {
          host: `partners-api.999.md`,
          path: "/images",
          port: 443,
          method: "POST",
          headers,
        };
        const postReq = http
          .request(options, (res) => {
            let total = "";
            res.on("data", (d) => {
              total += d;
            });
            res.on("end", () => {
              resolve(JSON.parse(total));
            });
          })
          .on("error", (e) => {
            console.log(e);
            reject(e);
          });
        formData.pipe(postReq);
      });

      const promiseResponse = await reqPhotoPromise;
      console.log(promiseResponse);
      cb(promiseResponse.image_id);
    };

    await getPhoto999Id(file, (imageId) => {
      photoId = imageId.split("?")[0];
    });

    try {
      unlinkSync(file.path);
    } catch (err) {
      console.log(err);
    }
  }
  const password = crypto.randomBytes(16).toString("hex");
  //Create user
  //Create salt and hash
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  try {
    const userData = {
      username,
      givenName,
      familyName,
      password: hash,
      groupId,
      e999Token,
      tel,
    };
    console.log(photoId);
    if (photoId) {
      userData.image = photoId;
    }
    const newUser = await User.create(userData);
    // console.log(newUser.dataValues.id);
    // const token = jwt.sign(
    //   { id: newUser.dataValues.id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: 54000 }
    // );

    // res.status(200).json({ token: token });
    res.status(200).json({ id: newUser.dataValues.id });
  } catch (err) {
    res.status(400).json({ err });
  }
});
module.exports = router;
