"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("property_types", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(32),
      },
      url: {
        type: Sequelize.STRING,
      },
      e999Id: Sequelize.INTEGER(32),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("property_types");
  },
};
