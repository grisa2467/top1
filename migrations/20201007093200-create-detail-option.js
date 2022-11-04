"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("detail_options", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      detailId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "details",
          key: "id",
        },
      },
      optionId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "options",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("detail_options");
  },
};
