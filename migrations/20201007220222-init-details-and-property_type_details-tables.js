"use strict";
const { details } = require("../db_data");
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
      uniqueDetailsList,
      uniqueOptionsList,
      detailsWithPropertyAndOfferType,
      getPropertyTypeDetailsEntries,
    } = await details(offerTypes, propertyTypes);

    await queryInterface.bulkInsert("details", uniqueDetailsList);
    await queryInterface.bulkInsert("options", uniqueOptionsList);
    const insertedDetails = await queryInterface.sequelize.query(
      "SELECT * FROM details",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const propertyTypeDetails = await getPropertyTypeDetailsEntries(
      insertedDetails,
      detailsWithPropertyAndOfferType
    );
    await queryInterface.bulkInsert(
      "property_type_details",
      propertyTypeDetails
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("details", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("property_type_details", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
    await queryInterface.bulkDelete("options", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
