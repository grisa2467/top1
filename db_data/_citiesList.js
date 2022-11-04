const regions = require("./_regionsList");
const https = require("https");
// regions.map(region => {

// })
const getCitiesFromRegion = async (regionId, callbackfn) => {
  const tempPromise = new Promise((resolve, reject) => {
    https
      .get(
        `https://hDO3tv2xXEweNnxyRYKrsz8cczNB:@partners-api.999.md/dependent_options?subcategory_id=1407&dependency_feature_id=7&lang=ro&parent_option_id=${regionId}`,
        (res) => {
          let totalData = "";
          res.on("data", (newData) => {
            totalData += newData;
          });
          res.on("end", () => {
            resolve(JSON.parse(totalData));
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
  const data = await tempPromise;
  callbackfn(
    data.options.map((d) => {
      return { e999Id: +d.id, name: d.title };
    })
  );
};

const getSectorsFromCity = async (cityId, callbackfn) => {
  const tempPromise = new Promise((resolve, reject) => {
    https
      .get(
        `https://hDO3tv2xXEweNnxyRYKrsz8cczNB:@partners-api.999.md/dependent_options?subcategory_id=1407&dependency_feature_id=8&lang=ro&parent_option_id=${cityId}`,
        (res) => {
          let totalData = "";
          res.on("data", (newData) => {
            totalData += newData;
          });
          res.on("end", () => {
            resolve(JSON.parse(totalData));
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
  const data = await tempPromise;
  callbackfn(
    data.options.map((d) => {
      return { e999Id: +d.id, name: d.title };
    })
  );
};

module.exports = {
  cities: async (insertedRegions, callbackfn) => {
    const citiesArray = [];
    for (let i = 0; i < insertedRegions.length; i++) {
      const region = insertedRegions[i];
      await getCitiesFromRegion(region.e999Id, (cities) => {
        citiesArray.push(...cities);
      });
    }
    return citiesArray;
  },
  regionsWithCities: async (insertedRegions, insertedCities) => {
    const regionsWithCities = [];

    for (let i = 0; i < insertedRegions.length; i++) {
      const region = insertedRegions[i];

      await getCitiesFromRegion(region.e999Id, (cities) => {
        for (let i = 0; i < cities.length; i++) {
          const city = cities[i];

          for (let i = 0; i < insertedCities.length; i++) {
            const insertedCity = insertedCities[i];

            if (city.e999Id === insertedCity.e999Id) {
              regionsWithCities.push({
                regionId: region.id,
                cityId: insertedCity.id,
              });
            }
          }
        }
      });
    }

    return regionsWithCities;
  },
  sectors: async (insertedCities) => {
    const uniqueSectorsSet = new Set();
    for (let i = 0; i < insertedCities.length; i++) {
      const insertedCity = insertedCities[i];
      await getSectorsFromCity(insertedCity.e999Id, (sectors) => {
        for (let i = 0; i < sectors.length; i++) {
          const s = sectors[i];

          uniqueSectorsSet.add(JSON.stringify(s));
        }
      });
    }

    const sectors = Array.from(uniqueSectorsSet).map((s) => JSON.parse(s));

    return sectors;
  },
  citySectors: async (insertedCities, insertedSectors) => {
    const citySectorsArray = [];
    for (let i = 0; i < insertedCities.length; i++) {
      const insertedCity = insertedCities[i];

      await getSectorsFromCity(insertedCity.e999Id, (sectors) => {
        for (let j = 0; j < sectors.length; j++) {
          const sector = sectors[j];

          for (let k = 0; k < insertedSectors.length; k++) {
            const insertedSector = insertedSectors[k];
            if (sector.e999Id === insertedSector.e999Id) {
              citySectorsArray.push({
                cityId: insertedCity.id,
                sectorId: insertedSector.id,
              });
            }
          }
        }
      });
    }
    return citySectorsArray;
  },
};
