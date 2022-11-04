const express = require("express");
const db = require("../models");
const multer = require("multer");
const auth = require("../middleware/auth");
const FormData = require("form-data");
const crypto = require("crypto");
const path = require("path");
const { createReadStream, unlinkSync } = require("fs");
const http = require("https");
const sleep = require("util").promisify(setTimeout);
const router = express.Router();

const Property = db.sequelize.models.Property;
const Location = db.sequelize.models.Location;
const PropertyDetail = db.sequelize.models.PropertyDetail;
const PropertyUtility = db.sequelize.models.PropertyUtility;

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

router.get("/all", auth, async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: db.sequelize.models.Location,
          as: "location",
          include: [
            {
              model: db.sequelize.models.Region,
              as: "region",
            },
            {
              model: db.sequelize.models.City,
              as: "city",
            },
            {
              model: db.sequelize.models.Sector,
              as: "sector",
            },
          ],
        },
        {
          model: db.sequelize.models.Photo,
          as: "photos",
        },
        {
          model: db.sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "e999Token",
              "createdAt",
              "updatedAt",
              "username",
            ],
          },
        },
      ],
    });
    res.status(200).json({ properties });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/images", async (req, res) => {
  const { propertyId } = req.query;
  if (!+propertyId) return res.status(400).json({ err: "No propertyId param" });
  const response = await db.sequelize.models.Photo.findAll({
    attributes: ["id", "url", "order"],
    where: {
      propertyId,
    },
    order: [["order", "ASC"]],
  });

  return res.status(200).json({ images: response });
});
router.delete("/", auth, async (req, res) => {
  try {
    const id = +req.query.id;
    if (!id) {
      return res.status(400).json({ err: "Indicate an integer param id" });
    }
    const { locationId } = await Property.findByPk(id);
    await Property.destroy({
      where: {
        id,
      },
    });
    await Location.destroy({
      where: {
        id: locationId,
      },
    });
    res.status(200).json({ msg: "ok" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.patch("/update", upload.array("images"), auth, async (req, res) => {
  const {
    title,
    description,
    price,
    oldPrice,
    userId,
    details: _details,
    utilities: _utils,
    newOrder,
    deletedPhotos,
    coordinates,
    priority,
  } = req.body;
  const propertyId = +req.body.propertyId;
  if (!propertyId)
    return res.status(400).json({ err: "No integer propertyId indicated" });
  const columnsToUpdate = {};
  if (title) columnsToUpdate.title = title;
  if (description) columnsToUpdate.description = description;
  if (price) columnsToUpdate.price = +price;
  if (oldPrice) columnsToUpdate.oldPrice = +oldPrice;
  if (userId) columnsToUpdate.userId = userId;
  if (priority) columnsToUpdate.priority = priority;
  columnsToUpdate.updatedAt = new Date();

  try {
    if (coordinates && coordinates !== "null") {
      const { lat, long, id: coordinatesId } = JSON.parse(coordinates);

      if (lat && long) {
        const getLastId = async () => {
          const last = await db.sequelize.query(
            "SELECT LAST_INSERT_ID() AS lastId",
            {
              type: db.Sequelize.QueryTypes.SELECT,
            }
          );
          return last[0].lastId;
        };
        if (!coordinatesId) {
          await db.sequelize.models.MapLocation.create({
            lat,
            long,
          });
          const newCoordinatesId = await getLastId();

          columnsToUpdate.mapLocationId = newCoordinatesId;
        } else {
          await db.sequelize.models.MapLocation.update(
            {
              lat,
              long: lng,
            },
            {
              where: {
                id: coordinatesId,
              },
            }
          );
        }
      }
    }

    const response = await Property.update(columnsToUpdate, {
      where: {
        id: propertyId,
      },
    });
    const originalNames = [];
    if (req.files && req.files.length && userId) {
      console.log(userId);
      console.log(req.body);
      const { e999Token: apiKey } = await db.sequelize.models.User.findByPk(
        userId,
        {
          attributes: ["e999Token"],
        }
      );

      const encodedApi = Buffer.from(`${apiKey}:`).toString("base64");

      // for (let i = 0; i < req.files.length; i++) {
      //   const file = req.files[i];
      //   console.log(file);
      //   await addWatermark(file.destination, file.filename, true);
      //   await sleep(1000);

      //   try {
      //     unlinkSync("./tmp/working.jpg");
      //   } catch (err) {
      //     res.status(500).json({ err });
      //   }
      // }

      const getPhoto999Id = async (file, cb) => {
        const reqPhotoPromise = new Promise((resolve, reject) => {
          const formData = new FormData();
          const fileLocation = path.join(file.destination, file.filename);
          // const fileLocation = "./tmp/processed.jpg";
          // const fileLocation = path.join(file.destination, "processed.jpg");
          const readStream = createReadStream(fileLocation);
          formData.append("file", readStream);
          const headers = {
            ...formData.getHeaders(),
            Authorization: `Basic ${encodedApi}`,
          };
          console.log(headers);
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
        cb(promiseResponse.image_id);
      };
      const photoIds = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        await getPhoto999Id(file, (_id) => {
          if (_id) {
            originalNames.push({ originalName: file.originalname });
            photoIds.push(_id);
          } else {
            console.log(file);
          }
        });
      }
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          unlinkSync(file.path);
        } catch (err) {
          console.log(err);
        }
      }

      for (let i = 0; i < photoIds.length; i++) {
        const url = photoIds[i].split("?")[0];
        await db.sequelize.models.Photo.create({
          propertyId,
          url,
        });
        const getLastId = async () => {
          const last = await db.sequelize.query(
            "SELECT LAST_INSERT_ID() AS lastId",
            {
              type: db.Sequelize.QueryTypes.SELECT,
            }
          );
          return last[0].lastId;
        };
        originalNames[i].id = await getLastId();
      }
    }

    if (deletedPhotos) {
      const _deletedPhotos = JSON.parse(deletedPhotos);
      for (let i = 0; i < _deletedPhotos.length; i++) {
        const dp = _deletedPhotos[i];
        await db.sequelize.models.Photo.destroy({
          where: {
            id: dp.id,
          },
        });
      }
    }
    if (newOrder) {
      const newOrderArr = JSON.parse(newOrder);
      console.log("neworder");
      console.log(originalNames);
      console.log(newOrder);
      for (let i = 0; i < newOrderArr.length; i++) {
        const ord = newOrderArr[i];
        console.log(ord);
        if (ord.id && typeof ord.id !== "string") {
          await db.sequelize.models.Photo.update(
            {
              order: ord.order,
            },
            {
              where: {
                id: ord.id,
              },
            }
          );
        } else {
          const origName = ord.id.substring(1);
          console.log(ord.id);
          const found = originalNames.find((n) => n.originalName === origName);
          if (found) {
            const { id: _id } = found;
            await db.sequelize.models.Photo.update(
              {
                order: ord.order,
              },
              {
                where: {
                  id: _id,
                },
              }
            );
          }
        }
      }
    }
    if (_details) {
      const details = JSON.parse(_details);
      for (let i = 0; i < details.length; i++) {
        const {
          id: detailId,
          modified,
          newValue,
          newOption,
          removed,
          newRecord,
        } = details[i];
        console.log(details[i]);

        if (modified) {
          if (removed) {
            await PropertyDetail.destroy({
              where: {
                propertyId,
                detailId,
              },
            });
          } else if (newValue) {
            if (newRecord) {
              await PropertyDetail.create({
                propertyId,
                detailId,
                value: newValue,
              });
            } else
              await PropertyDetail.update(
                {
                  value: newValue,
                },
                {
                  where: {
                    propertyId,
                    detailId,
                  },
                }
              );
          } else if (newOption && newOption === -1) {
            await PropertyDetail.destroy({
              where: {
                propertyId,
                detailId,
              },
            });
          } else if (newOption) {
            if (newRecord)
              await PropertyDetail.create({
                propertyId,
                detailId,
                optionId: newOption,
              });
            else
              await PropertyDetail.update(
                {
                  optionId: newOption,
                },
                {
                  where: {
                    propertyId,
                    detailId,
                  },
                }
              );
          }
        }
      }
    }

    if (_utils) {
      const utilities = JSON.parse(_utils);
      for (let i = 0; i < utilities.length; i++) {
        const { id: utilityId, modified, added, removed } = utilities[i];
        if (modified) {
          if (added) {
            await PropertyUtility.create({
              propertyId,
              utilityId,
            });
          } else if (removed) {
            await PropertyUtility.destroy({
              where: {
                propertyId,
                utilityId,
              },
            });
          }
        }
      }
    }

    res.status(200).json({ msg: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

module.exports = router;
