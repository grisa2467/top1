"use strict";
const { offerTypes } = require("../db_data");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("offer_types", offerTypes);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("offer_types", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
