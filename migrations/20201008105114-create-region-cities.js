"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("region_cities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      regionId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "regions",
          key: "id",
        },
      },
      cityId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "cities",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("region_cities");
  },
};
