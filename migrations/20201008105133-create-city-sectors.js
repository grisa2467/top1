"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("city_sectors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cityId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "cities",
          key: "id",
        },
      },
      sectorId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "sectors",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("city_sectors");
  },
};
