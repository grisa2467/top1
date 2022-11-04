require('dotenv-flow').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const FormData = require('form-data')
const { createReadStream, unlinkSync } = require('fs')
const http = require('https')
const fs = require('fs')
const sleep = require('util').promisify(setTimeout)
const prerender = require('prerender-node')
function roughSizeOfObject (object) {
  var objectList = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        stack.push(value[i])
      }
    }
  }
  return bytes
}
// const storage = multer.diskStorage({
//   destination: "./tmp",
//   filename: (req, file, cb) => {
//     const [originalFilename, ext] = file.originalname.split(".");
//     const newFilename =
//       "" + Date.now() + crypto.randomBytes(16).toString("hex") + "." + ext;
//     cb(null, newFilename);
//   },
// });
const upload = multer({ dest: './tmp/' })
const router = express.Router()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(router)
const db = require('./models')
const { Buffer } = require('buffer')
const auth = require('./middleware/auth')
const { Op } = require('sequelize')
const { sequelize } = require('./models')

app.get('/api/properties', async (req, res) => {
  const {
    propertyTypeId,
    offerTypeId,
    s,
    minPrice,
    maxPrice,
    minSurface,
    maxSurface,
    rooms,
    building,
    tdest,
    cdest,
    houseType,
    l: locationsQuery,
    limit = 12,
    page = 1,
    userId,
    ids,
    buildingState
  } = req.query
  // const _data = req.query.data ? JSON.parse(data) : null;
  let whereAnd = []
  if (propertyTypeId) whereAnd.push({ propertyTypeId })
  if (offerTypeId) whereAnd.push({ offerTypeId })
  if (ids) whereAnd.push({ id: ids })
  if (userId && [1, 7, 22].includes(+userId))
    whereAnd.push({ userId: [1, 7, 22] })
  else if (userId) whereAnd.push({ userId })
  if (minPrice || maxPrice) {
    const _min = minPrice !== null && +minPrice >= 0 ? minPrice : '0'
    const _max = maxPrice !== null && +maxPrice >= _min ? maxPrice : '99999999'
    whereAnd.push(
      db.sequelize.where(
        db.sequelize.cast(sequelize.col('price'), 'UNSIGNED'),
        { [Op.gte]: _min, [Op.lte]: _max }
      )
    )
  }
  if (propertyTypeId && (minSurface || maxSurface)) {
    const _min = minSurface !== null && +minSurface >= 0 ? minSurface : '0'
    const _max =
      maxSurface !== null && +maxSurface >= _min ? maxSurface : '99999999'
    const surfaceDetailId = propertyTypeId === '29' ? '222' : '210'
    const r = await db.sequelize.models.PropertyDetail.findAll({
      where: {
        [Op.and]: [
          { detailId: surfaceDetailId },
          db.sequelize.where(
            db.sequelize.cast(sequelize.col('value'), 'UNSIGNED'),
            { [Op.gte]: _min, [Op.lte]: _max }
          )
        ]
      },
      attributes: ['propertyId']
    })
    const _arr = r.map(i => i.propertyId)
    whereAnd.push({ id: _arr })
  }
  if (s) {
    const _search = decodeURIComponent(s)
    const usersLike = await db.sequelize.models.User.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: [
          db.Sequelize.where(
            db.Sequelize.fn('lower', db.Sequelize.col('givenName')),
            {
              [Op.like]: '%' + _search + '%'
            }
          ),

          db.Sequelize.where(
            db.Sequelize.fn('lower', db.Sequelize.col('familyName')),
            {
              [Op.like]: '%' + _search + '%'
            }
          )
        ]
      }
    })
    const usersIds = usersLike.map(u => u.id)
    whereAnd.push({
      [Op.or]: [
        {
          id: {
            [Op.like]: '%' + _search + '%'
          }
        },
        {
          description: {
            [Op.like]: '%' + _search + '%'
          }
        },
        {
          title: {
            [Op.like]: '%' + _search + '%'
          }
        },
        {
          userId: usersIds
        }
      ]
    })

    // console.log(usersIds);
    // whereAnd.push({
    //   [Op.or]: [
    //     {
    //       userId: usersIds,
    //     },
    //   ],
    // });
  }

  if (propertyTypeId) {
    const filterDetails = []
    if (+propertyTypeId === 27) {
      //Apartments
      if (rooms)
        filterDetails.push({ detailId: 205, optionId: rooms.split('r') })

      if (buildingState)
        filterDetails.push({
          detailId: 214,
          optionId: buildingState.split('r')
        })
      if (building)
        filterDetails.push({
          detailId: 204,
          optionId: building.split('r')
        })
      // if (building) filterDetails.push({ detailId: 204, optionId: building });
    } else if (+propertyTypeId === 28) {
      //Houses
      if (houseType)
        filterDetails.push({ detailId: 218, optionId: houseType.split('r') })
    } else if (+propertyTypeId === 29) {
      //Lands
      if (tdest)
        filterDetails.push({ detailId: 224, optionId: tdest.split('r') })
    } else if (+propertyTypeId === 30) {
      //Comercial
      if (cdest)
        filterDetails.push({
          detailId: 226,
          optionId:
            +cdest !== 1199
              ? cdest
              : {
                  [Op.gte]: 1197,
                  [Op.lte]: 1205
                }
        })
    }
    const promises = filterDetails.map(fd => {
      return db.sequelize.models.PropertyDetail.findAll({
        where: {
          detailId: fd.detailId,
          optionId: fd.optionId
        },
        attributes: ['propertyId']
      })
    })
    const _pids = await Promise.all(promises)
    for (let i = 0; i < _pids.length; i++) {
      const r = _pids[i]
      // r.forEach((i) => validPropertiesIdSet.add(i.propertyId));
      const _arr = r.map(i => i.propertyId)
      whereAnd.push({ id: _arr })
    }
  }
  const filterLocations = await db.sequelize.models.Location.findAll({
    attributes: [
      'sectorId',
      'cityId',
      [sequelize.fn('COUNT', 'sectorId'), 'propertiesPerSector']
    ],
    group: ['sectorId'],
    include: [
      {
        model: db.sequelize.models.Property,
        as: 'property',
        attributes: [],
        where: whereAnd
      },
      {
        model: db.sequelize.models.City,
        as: 'city',
        attributes: ['name', 'id']
      },
      {
        model: db.sequelize.models.Sector,
        as: 'sector',
        attributes: ['name', 'id']
      }
    ]
  })

  const includedLocation = {
    model: db.sequelize.models.Location,
    as: 'location',
    attributes: {
      exclude: ['id', 'createdAt', 'updatedAt']
    },
    include: [
      {
        model: db.sequelize.models.Region,
        as: 'region',
        attributes: {
          exclude: ['id', 'e999Id']
        }
      },
      {
        model: db.sequelize.models.City,
        as: 'city',
        attributes: {
          exclude: ['e999Id']
        }
      },
      {
        model: db.sequelize.models.Sector,
        as: 'sector',
        attributes: {
          exclude: ['e999Id']
        }
      }
    ]
  }
  if (locationsQuery)
    includedLocation.where = { sectorId: locationsQuery.split('a') }

  const detailFilter = [224, 222, 205, 210, 207, 206, 219, 226, 216]
  // const _properties = await db.sequelize.query("SELECT * FROM `properties`", {
  //   // nest: true,
  //   type: QueryTypes.SELECT,
  // });
  // console.log(JSON.stringify(_properties));
  const _properties = await db.sequelize.models.Property.findAll({
    where: {
      // [Op.or]:
      [Op.and]: whereAnd
    },
    attributes: [
      'id',
      'offerTypeId',
      'propertyTypeId',
      'price',
      'oldPrice',
      'userId',
      'priority',
      'createdAt'
    ],
    order: [
      ['priority', 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit: +limit,
    offset: page > 0 ? (page - 1) * +limit : 0,
    include: [
      {
        separate: true,
        model: db.sequelize.models.PropertyDetail,
        as: 'propertyDetails',
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        },
        include: [
          {
            model: db.sequelize.models.Detail,
            as: 'details',
            attributes: ['name', 'units'],
            where: {
              id: detailFilter
            }
          },
          {
            model: db.sequelize.models.Option,
            attributes: ['name'],
            as: 'optionValue'
          }
        ]
      },
      // {
      //   model: db.sequelize.models.Utility,
      //   as: "utilities",
      // },
      includedLocation
      // {
      //   model: db.sequelize.models.User,
      //   as: "user",
      //   attributes: {
      //     exclude: [
      //       "password",
      //       "e999Token",
      //       "createdAt",
      //       "updatedAt",
      //       "username",
      //     ],
      //   },
      // },
      // {
      //   model: db.sequelize.models.Photo,
      //   as: "photos",
      //   attributes: ["url", "id"],
      //   where: {
      //     order: 0,
      //   },
      // },
    ]
  })

  // console.timeEnd("propertiesFetchs");
  // console.log(`rough size: ${roughSizeOfObject(_properties) / 1024 / 1024}`);
  // const properties = []
  // for (let i = 0; i < _properties.length; i++) {
  //   const property = _properties[i];
  //   const region
  // }
  // console.log(_properties);
  // used = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${used} MB`);
  res.status(200).json({ properties: _properties, filterLocations })
})

app.get('/api/property', async (req, res) => {
  const { propertyId } = req.query
  const property = await db.sequelize.models.Property.findByPk(+propertyId, {
    attributes: [
      'id',
      'description',
      'price',
      'oldPrice',
      'propertyTypeId',
      'offerTypeId',
      'title',
      'priority'
    ],
    include: [
      //   {
      //     model: db.sequelize.models.PropertyDetail,
      //     as: "propertyDetails",

      //     include: [
      //       {
      //         model: db.sequelize.models.Detail,
      //         as: "details",
      //       },
      //       {
      //         model: db.sequelize.models.Option,
      //         as: "optionValue",
      //       },
      //     ],
      //   },
      //   {
      //     model: db.sequelize.models.Utility,
      //     as: "utilities",
      //   },
      {
        model: db.sequelize.models.Location,
        as: 'location',
        include: [
          {
            model: db.sequelize.models.Region,
            as: 'region'
          },
          {
            model: db.sequelize.models.City,
            as: 'city'
          },
          {
            model: db.sequelize.models.Sector,
            as: 'sector'
          }
        ]
      },
      {
        model: db.sequelize.models.MapLocation,
        as: 'mapLocation'
      },
      {
        model: db.sequelize.models.User,
        as: 'user',
        attributes: {
          exclude: [
            'password',
            'e999Token',
            'createdAt',
            'updatedAt',
            'username'
          ]
        }
      }
    ]
  })
  //
  const propertyDetails = await db.sequelize.models.PropertyDetail.findAll({
    where: {
      propertyId: +propertyId
    },
    attributes: ['detailId', 'optionId', 'value'],
    include: [
      {
        attributes: ['name', 'units'],
        model: db.sequelize.models.Detail,
        as: 'details'
      },
      {
        attributes: ['name'],
        model: db.sequelize.models.Option,
        as: 'optionValue'
      }
    ]
  })
  const utilities = await db.sequelize.models.PropertyUtility.findAll({
    where: {
      propertyId: +propertyId
    },
    attributes: ['utilityId'],
    include: [
      {
        model: db.sequelize.models.Utility,
        as: 'utilities',
        attributes: ['name']
      }
    ]
  })
  // console.log(utilities);
  const photos = await db.sequelize.models.Photo.findAll({
    where: {
      propertyId: +propertyId
    }
  })
  res.status(200).json({ property, propertyDetails, utilities, photos })
})

app.post(
  '/api/add-property',
  upload.array('images'),
  auth,
  async (req, res) => {
    console.log('Start')
    let used = process.memoryUsage().heapUsed / 1024 / 1024
    console.log(`The script uses approximately ${used} MB`)
    const userId = req.body.agentId ? +req.body.agentId : req.user.id
    // console.log(req.body.agentId);
    // console.log(userId);
    const { e999Token: apiKey, tel } = await db.sequelize.models.User.findByPk(
      userId,
      {
        attributes: ['e999Token', 'tel']
      }
    )
    const offerTypeId = +req.body.offerTypeId
    const propertyTypeId = +req.body.propertyTypeId
    const regionId = +req.body.regionId
    const cityId = +req.body.cityId
    const sectorId = +req.body.sectorId
    const street = req.body.street
    const house = req.body.house
    const title = req.body.title
    const price = +req.body.price
    const oldPrice = +req.body.oldPrice
    const description = req.body.description
    const description999 = req.body.description999
    const postOn999 = req.body.postOn999 === 'true'
    const newOrder = req.body.newOrder
    const priority = req.body.priority
    const coordinates = req.body.coordinates
    // console.log(oldPrice);
    // console.log(apiKey, tel);
    // const images = req.body.images ? req.body.images : null;

    //XcXkmpD8kdPWaZ6pTCyDEVkoiRXR
    //37376771252

    //999 subcategory
    const subcategory = await db.sequelize.models.PropertyType.findByPk(
      propertyTypeId
    )
    const subcategory999Id = '' + subcategory.e999Id
    //999 offer_type
    const offer_type = await db.sequelize.models.OfferType.findByPk(offerTypeId)
    const offer_type999Id = '' + offer_type.e999Id
    //999 region
    const region = await db.sequelize.models.Region.findByPk(regionId)
    const region999Id = '' + region.e999Id
    //999 city
    const city = await db.sequelize.models.City.findByPk(cityId)
    const city999Id = '' + city.e999Id
    //999 sector
    const sector = await db.sequelize.models.Sector.findByPk(sectorId)
    const sector999Id = '' + sector.e999Id

    //Details and Utilities
    const obj = JSON.parse(JSON.stringify(req.body))
    const detailsAndUtilities = []
    for (let i = 0; i < Object.keys(obj).length; i++) {
      const key = Object.keys(obj)[i]
      if (key[0] === '_') {
        const _id = key.substring(2)
        if (key[1] === 'd') {
          //Detail found
          const value = obj[key]
          if (value && +value !== -1) {
            const detail = await db.sequelize.models.Detail.findByPk(_id)
            const d999Id = '' + detail.e999Id
            if (value[0] === '_') {
              const _optionId = value.substring(2)
              const option = await db.sequelize.models.Option.findByPk(
                _optionId
              )
              const o999Id = '' + option.e999Id
              detailsAndUtilities.push({
                detailId: _id,
                d999Id,
                optionId: _optionId,
                o999Id
              })
            } else {
              detailsAndUtilities.push({
                detailId: _id,
                d999Id,
                value: +value,
                units: detail.units
              })
            }
          }
        } else if (key[1] === 'u') {
          //Utility found
          const utility = await db.sequelize.models.Utility.findByPk(_id)
          detailsAndUtilities.push({
            utilityId: _id,
            u999Id: '' + utility.e999Id
          })
        }
      }
    }

    const isInteger = n => n.toString().split('.').length === 1

    const featuresDetailsAndUtilities999 = detailsAndUtilities.map(item => {
      let pre = {
        id: item.d999Id || item.u999Id,
        value: item.u999Id ? true : item.o999Id ? item.o999Id : item.value
      }
      if (item.units) {
        if (parseInt(item.d999Id) === 245) {
          pre = isInteger(item.value)
            ? { ...pre, value: item.value, unit: 'ha' }
            : { ...pre, value: item.value * 100, unit: 'ar' }
        } else {
          pre = { ...pre, unit: item.units }
        }
      }
      return pre
    })

    // used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(`The script uses approximately ${used} MB before photo`);

    const encodedApi = Buffer.from(`${apiKey}:`).toString('base64')
    let photoIds = []
    // req.files = [];
    let newOrderArr = []
    console.log(newOrder)
    // console.log(req.files);
    if (newOrder) {
      newOrderArr = JSON.parse(newOrder)
      // console.log(newOrderArr);
      req.files.sort((a, b) => {
        const first = newOrderArr.find(o => o.id === '_' + a.originalname).order
        const second = newOrderArr.find(o => o.id === '_' + b.originalname)
          .order
        return first - second
      })
    }
    // for (let i = 0; i < req.files.length; i++) {
    //   used = process.memoryUsage().heapUsed / 1024 / 1024;
    //   const file = req.files[i];
    //   // console.log(file);
    //   // console.log(`The script uses approximately ${used} MB before wm photo`);

    //   // // await addWatermark(file.destination, file.filename, true);
    //   // used = process.memoryUsage().heapUsed / 1024 / 1024;
    //   // console.log(`The script uses approximately ${used} MB after wm photo`);
    //   await sleep(1000);
    //   try {
    //     // unlinkSync(file.path);
    //     unlinkSync("./tmp/working.jpg");
    //     // unlinkSync("./tmp/processed.jpg");
    //   } catch (err) {
    //     res.status(500).json({ err });
    //   }
    // }
    // used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(`The script uses approximately ${used} MB. Watermark`);
    // const getPhoto999Id = async (file, cb) => {
    //   const reqPhotoPromise = new Promise((resolve, reject) => {
    //     const formData = new FormData();
    //     // const fileLocation = "./tmp/processed.jpg";
    //     const fileLocation = path.join(file.destination, file.filename);
    //     const readStream = createReadStream(fileLocation);
    //     formData.append("file", readStream);
    //     const headers = {
    //       ...formData.getHeaders(),
    //       Authorization: `Basic ${encodedApi}`,
    //     };
    //     const options = {
    //       host: `partners-api.999.md`,
    //       path: "/images",
    //       port: 443,
    //       method: "POST",
    //       headers,
    //     };
    //     const postReq = http
    //       .request(options, (res) => {
    //         let total = "";
    //         res.on("data", (d) => {
    //           total += d;
    //         });
    //         res.on("end", () => {
    //           resolve(JSON.parse(total));
    //         });
    //       })
    //       .on("error", (e) => {
    //         console.log(e);
    //         reject(e);
    //       });
    //     formData.pipe(postReq);
    //   });

    //   const promiseResponse = await reqPhotoPromise;
    //   // console.log(promiseResponse);
    //   cb(promiseResponse.image_id);
    // };
    // for (let i = 0; i < req.files.length; i++) {
    //   const file = req.files[i];
    //   console.log(file);
    //   // await addWatermark(file.destination, file.filename, true);
    //   await getPhoto999Id(file, (_id) => {
    //     if (_id) {
    //       photoIds.push(_id);
    //     } else {
    //       console.log(file);
    //     }
    //   });
    // }
    const reqPhotoPromise = file => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        // const fileLocation = "./tmp/processed.jpg";
        const fileLocation = path.join(file.destination, file.filename)
        const readStream = createReadStream(fileLocation)
        formData.append('file', readStream)
        const headers = {
          ...formData.getHeaders(),
          Authorization: `Basic ${encodedApi}`
        }
        const options = {
          host: `partners-api.999.md`,
          path: '/images',
          port: 443,
          method: 'POST',
          headers
        }
        const postReq = http
          .request(options, res => {
            let total = ''
            res.on('data', d => {
              total += d
            })
            res.on('end', () => {
              const r = JSON.parse(total)
              if (r.image_id) {
                resolve(r.image_id)
              } else reject()
            })
          })
          .on('error', e => {
            console.log(e)
            reject(e)
          })
        formData.pipe(postReq)
      })
    }

    // const proms = req.files.map((file) => reqPhotoPromise(file));
    // photoIds = await Promise.all(proms);
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]
      try {
        const _id = await reqPhotoPromise(file)
        photoIds.push(_id)
        try {
          unlinkSync(file.path)
        } catch (err) {
          console.log(err)
        }
      } catch (e) {
        console.log(e)
      }
    }

    // console.log("photoIds");
    // console.log(photoIds);
    // const uploadedImage999Response = await reqPhotoPromise;
    // const imgId = uploadedImage999Response.image_id

    // console.log(featuresDetailsAndUtilities999)
    const data = {
      category_id: '270',
      subcategory_id: subcategory999Id,
      offer_type: offer_type999Id,
      features: [
        //title
        {
          id: '12',
          value: title
        },
        //description
        {
          id: '13',
          value: description999
        },
        //price
        {
          id: '2',
          value: price,
          unit: 'eur'
        },
        //country - Moldova
        {
          id: '5',
          value: '12869'
        },
        //Region
        {
          id: '7',
          value: '' + region999Id
        },
        //City
        {
          id: '8',
          value: '' + city999Id
        },
        //Sector
        {
          id: '9',
          value: '' + sector999Id
        },
        //Street
        {
          id: '10',
          value: street
        },
        //House
        {
          id: '11',
          value: house
        },
        //Tel
        {
          id: '16',
          value: [tel]
        },
        //Photos
        {
          id: '14',
          value: photoIds
        },
        ...featuresDetailsAndUtilities999
      ]
    }
    // console.log(data);
    // console.log(photoIds);
    let preparedData = JSON.stringify(data)
    preparedData = preparedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
      return '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).substr(-4)
    })
    // console.log(preparedData);

    const reqPromise = new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/json',
        'Content-Length': preparedData.length,
        Authorization: `Basic ${encodedApi}`
      }

      const postOptions = {
        host: `partners-api.999.md`,
        path: '/adverts',
        port: 443,
        method: 'POST',
        headers
      }
      const postReq = http
        .request(postOptions, res => {
          let total = ''
          res.on('data', d => {
            total += d
          })
          res.on('end', () => {
            resolve(JSON.parse(total))
          })
        })
        .on('error', e => {
          console.log(e)
          reject(e)
        })
      postReq.write(preparedData)
      postReq.end()
    })

    // let _999Response;
    // if (postOn999) {
    //   _999Response = await reqPromise;
    // } else {
    //   _999Response = { advert: { id: null } };
    // }
    const _999Response = postOn999 ? await reqPromise : { advert: { id: null } }
    console.log(_999Response)
    // const _999Response = { advert: { id: "121333" } };
    if (_999Response.error) {
      _999Response.error.errors.forEach(i => {
        console.log(i)
      })
      return res
        .status(500)
        .json({ err: _999Response.error, type: 'array', origin: '999' })
    } else {
      const advertId = _999Response.advert.id
      // console.log(advertId);
      await db.sequelize.models.Location.create({
        regionId,
        cityId,
        sectorId,
        street,
        houseNr: house
      })
      const getLastId = async () => {
        const last = await db.sequelize.query(
          'SELECT LAST_INSERT_ID() AS lastId',
          {
            type: db.Sequelize.QueryTypes.SELECT
          }
        )
        return last[0].lastId
      }
      const locationId = await getLastId()
      // console.log(oldPrice);
      let mapLocationId = null
      if (coordinates) {
        const { lat, long } = JSON.parse(coordinates)

        await db.sequelize.models.MapLocation.create({
          lat,
          long
        })
        mapLocationId = await getLastId()
      }
      await db.sequelize.models.Property.create({
        title,
        description,
        price: +price,
        oldPrice: oldPrice ? oldPrice : null,
        e999AdvertId: advertId,
        propertyTypeId,
        offerTypeId,
        locationId,
        userId,
        priority,
        mapLocationId
      })
      used = process.memoryUsage().heapUsed / 1024 / 1024
      console.log(`The script uses approximately ${used} Created prop`)
      const propertyId = await getLastId()
      for (let i = 0; i < photoIds.length; i++) {
        const url = photoIds[i].split('?')[0]
        await db.sequelize.models.Photo.create({
          propertyId,
          url,
          order: i
        })
      }

      // if (newOrderArr.length) {
      //   console.log("neworder");
      //   console.log(originalNames);
      //   console.log(newOrder);
      //   for (let i = 0; i < newOrderArr.length; i++) {
      //     const ord = newOrderArr[i];
      //     console.log(ord);
      //     if (ord.id && typeof ord.id !== "string") {
      //       await db.sequelize.models.Photo.update(
      //         {
      //           order: ord.order,
      //         },
      //         {
      //           where: {
      //             id: ord.id,
      //           },
      //         }
      //       );
      //     } else {
      //       const origName = ord.id.substring(1);
      //       console.log(ord.id);
      //       const found = originalNames.find(
      //         (n) => n.originalName === origName
      //       );
      //       if (found) {
      //         const { id: _id } = found;
      //         await db.sequelize.models.Photo.update(
      //           {
      //             order: ord.order,
      //           },
      //           {
      //             where: {
      //               id: _id,
      //             },
      //           }
      //         );
      //       }
      //     }
      //   }
      // }

      for (let i = 0; i < detailsAndUtilities.length; i++) {
        const item = detailsAndUtilities[i]
        if (item.detailId) {
          if (item.optionId) {
            await db.sequelize.models.PropertyDetail.create({
              propertyId,
              detailId: item.detailId,
              optionId: item.optionId
            })
          } else {
            await db.sequelize.models.PropertyDetail.create({
              propertyId,
              detailId: item.detailId,
              value: '' + item.value
            })
          }
        } else if (item.utilityId) {
          await db.sequelize.models.PropertyUtility.create({
            propertyId,
            utilityId: item.utilityId
          })
        }
      }

      // for (let i = 0; i < photoIds.length; i++) {
      //   const url = photoIds[i];
      //   await db.sequelize.models.Photo.create({
      //     propertyId,
      //     url,
      //   });
      // }
      used = process.memoryUsage().heapUsed / 1024 / 1024
      console.log(`The script uses approximately ${used} MB end`)
      console.log('end')
      res.status(200).json({ id: propertyId })
    }
  }
)

app.get('/api/regions', async (req, res) => {
  const response = await db.sequelize.models.Region.findAll()

  res.status(200).json({ regions: response })
})

app.get('/api/cities', async (req, res) => {
  const regionId = +req.query.regionId
  const response = await db.sequelize.models.Region.findByPk(regionId, {
    include: [{ model: db.sequelize.models.City, as: 'cities' }]
  })

  res.status(200).json({ cities: response.cities })
})

app.get('/api/sectors', async (req, res) => {
  const cityId = +req.query.cityId
  const response = await db.sequelize.models.City.findByPk(cityId, {
    include: [{ model: db.sequelize.models.Sector, as: 'sectors' }]
  })

  res.status(200).json({ sectors: response.sectors })
})

app.get('/api/details', async (req, res) => {
  const offerTypeId = +req.query.offerTypeId
  const propertyTypeId = +req.query.propertyTypeId
  const errors = []

  //Validate the offerTypeId param
  if (!req.query.offerTypeId) {
    errors.push({ err: 'Please add offerTypeId param' })
  } else if (+offerTypeId !== Math.floor(+offerTypeId)) {
    errors.push({ err: 'offerTypeId must be an integer' })
  }
  //Validate the propertyTypeId param
  if (!req.query.propertyTypeId) {
    errors.push({ err: 'Please add propertyTypeId param' })
  } else if (+propertyTypeId !== Math.floor(+propertyTypeId)) {
    errors.push({ err: 'propertyTypeId must be an integer' })
  }

  if (errors.length) {
    res.status(400).json({ errors })
  } else {
    const _response = await db.sequelize.models.PropertyTypeDetail.findAll({
      where: {
        propertyTypeId,
        offerTypeId
      },
      include: [
        {
          model: db.sequelize.models.Detail,
          as: 'details',
          include: [
            {
              model: db.sequelize.models.DetailOption,
              as: 'detailOptions',
              include: [{ model: db.sequelize.models.Option, as: 'options' }]
            }
          ]
        }
      ]
    })
    res.status(200).json(_response)
  }
})

app.get('/api/utilities', async (req, res) => {
  const offerTypeId = +req.query.offerTypeId
  const propertyTypeId = +req.query.propertyTypeId
  const errors = []
  //Validate the offerTypeId param
  if (!req.query.offerTypeId) {
    errors.push({ err: 'Please add offerTypeId param' })
  } else if (+offerTypeId !== Math.floor(+offerTypeId)) {
    errors.push({ err: 'offerTypeId must be an integer' })
  }
  //Validate the propertyTypeId param
  if (!req.query.propertyTypeId) {
    errors.push({ err: 'Please add propertyTypeId param' })
  } else if (+propertyTypeId !== Math.floor(+propertyTypeId)) {
    errors.push({ err: 'propertyTypeId must be an integer' })
  }

  if (errors.length) {
    res.status(400).json({ errors })
  } else {
    const _response = await db.sequelize.models.PropertyTypeUtility.findAll({
      where: {
        propertyTypeId,
        offerTypeId
      },
      include: [
        {
          model: db.sequelize.models.Utility,
          as: 'utilities'
        }
      ]
    })
    const response = _response.map(item => item.utilities)
    res.status(200).json(response)
  }
})

app.get('/api/propertytypes', async (req, res) => {
  const response = await db.sequelize.models.PropertyType.findAll({
    where: {
      id: 27
    },
    include: [
      {
        model: db.sequelize.models.Detail
      }
    ]
  })
  res.json(response)
})

app.use('/api/users', require('./routes/users'))
app.use('/api/groups', require('./routes/groups'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/info', require('./routes/info'))
app.use('/api/mail', require('./routes/mail'))
app.use('/api/properties', require('./routes/properties'))

// app.use(express.static("client/build"));
// app.get("/property/:id", async (req, res) => {
//   // console.log("id");
//   // console.log(req.params);
//   const filePath = path.resolve(__dirname, "client", "build", "index.html");
//   // res.sendFile(filePath);
//   fs.readFile(filePath, async (err, data) => {
//     if (err) return console.log(err);
//     const id = +req.params.id;
//     let rData = data.toString("utf-8");
//     const photo = await db.sequelize.models.Photo.findOne({
//       where: {
//         propertyId: id,
//       },
//       attributes: ["url"],
//     });
//     const property = await db.sequelize.models.Property.findByPk(id, {
//       attributes: ["title"],
//     });
//     // console.log(photo.url);
//     // console.log(property.title);
//     // res.send(data.toString("utf-8"));
//     rData = rData.replace(
//       "<head>",
//       `<head><meta property="og:title" content="${
//         property.title
//       }" /><meta property="og:image" content="https://i.simpalsmedia.com/999.md/BoardImages/320x240/${
//         photo.url.split("?")[0]
//       }" />`
//     );

//     res.send(rData);
//     console.log(typeof data);
//     console.log(data.toString("utf-8"));

//     // res.send("<p>hi</p>");
//   });
// });
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('/property/:id', async (req, res) => {
    // console.log("id");
    // console.log(req.params);
    const filePath = path.resolve(__dirname, 'client', 'build', 'index.html')
    // res.sendFile(filePath);
    fs.readFile(filePath, async (err, data) => {
      if (err) return console.log(err)
      const id = +req.params.id
      let rData = data.toString('utf-8')
      const photo = await db.sequelize.models.Photo.findOne({
        where: {
          propertyId: id
        },
        attributes: ['url']
      })
      const property = await db.sequelize.models.Property.findByPk(id, {
        attributes: ['title']
      })
      // console.log(photo.url);
      // console.log(property.title);
      // res.send(data.toString("utf-8"));
      rData = rData.replace(
        '<head>',
        `<head><meta property="og:title" content="${
          property.title
        }" /><meta property="og:image" content="https://i.simpalsmedia.com/999.md/BoardImages/320x240/${
          photo.url.split('?')[0]
        }" />`
      )

      res.send(rData)
      // console.log(typeof data);
      // console.log(data.toString("utf-8"));

      // res.send("<p>hi</p>");
    })
  })
  app.get('*', (req, res) => {
    // console.log(req);
    // const filePath = path.resolve(__dirname, "client", "build", "index.html");
    // fs.readFile(filePath, (err, data) => {
    //   if (err) return console.log(err);
    //   if(req.path)
    //   res.send(data);
    // });
    // res.sendFile();
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT || 5000, err => {
  if (err) return console.error('Error. Attempt to listen to port: ', PORT)

  console.log('Server is listening to port: ' + PORT)
  console.log(`http://localhost:${PORT}/`)
})
