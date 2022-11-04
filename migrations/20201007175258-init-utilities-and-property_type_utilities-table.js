"use strict";
const { utilities } = require("../db_data");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const offerTypes = await queryInterface.sequelize.query(
      "SELECT * FROM offer_types",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const propertyTypes = await queryInterface.sequelize.query(
      "SELECT * FROM property_types",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const {
      uniqueUtilitiesList,
      utilitiesWithPropertyAndOfferType,
      getPropertyTypeUtilities,
    } = await utilities(offerTypes, propertyTypes);
    await queryInterface.bulkInsert("utilities", uniqueUtilitiesList);
    const insertedUtilities = await queryInterface.sequelize.query(
      "SELECT * FROM utilities",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const propertyTypeUtilities = await getPropertyTypeUtilities(
      insertedUtilities,
      utilitiesWithPropertyAndOfferType
    );
    await queryInterface.bulkInsert(
      "property_type_utilities",
      propertyTypeUtilities
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("utilities", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("property_type_utilities", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
