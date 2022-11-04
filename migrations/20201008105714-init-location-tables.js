"use strict";
const regionsList = require("../db_data/_regionsList");
const { getCitiesAndRegionCities } = require("../db_data");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "regions",
      regionsList.map((region) => {
        return { name: region.title, e999Id: region.id };
      })
    );
    const insertedRegions = await queryInterface.sequelize.query(
      "SELECT * FROM regions",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const cities = await getCitiesAndRegionCities.cities(insertedRegions);
    await queryInterface.bulkInsert("cities", cities);
    const insertedCities = await queryInterface.sequelize.query(
      "SELECT * FROM cities",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const regionCities = await getCitiesAndRegionCities.regionsWithCities(
      insertedRegions,
      insertedCities
    );
    await queryInterface.bulkInsert("region_cities", regionCities);

    const sectors = await getCitiesAndRegionCities.sectors(insertedCities);

    await queryInterface.bulkInsert("sectors", sectors);
    const insertedSectors = await queryInterface.sequelize.query(
      "SELECT * FROM sectors",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const citySectors = await getCitiesAndRegionCities.citySectors(
      insertedCities,
      insertedSectors
    );
    await queryInterface.bulkInsert("city_sectors", citySectors);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("regions", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("cities", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("region_cities", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("sectors", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("city_sectors", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
