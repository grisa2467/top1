"use strict";
const { propertyTypes } = require("../db_data");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "property_types",
      propertyTypes.map(({ title, id, url }) => {
        return {
          name: title,
          e999Id: id,
          url,
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("property_types", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
