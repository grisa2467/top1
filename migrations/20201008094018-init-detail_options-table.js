"use strict";

const { detailOptions } = require("../db_data");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const details = await queryInterface.sequelize.query(
      "SELECT * FROM details",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const options = await queryInterface.sequelize.query(
      "SELECT * FROM options",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const detailOptionsArray = await detailOptions(details, options);
    await queryInterface.bulkInsert("detail_options", detailOptionsArray);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("detail_options", {
      id: {
        [Sequelize.Op.gt]: -1,
      },
    });
  },
};
