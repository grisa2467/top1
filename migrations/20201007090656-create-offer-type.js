"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("offer_types", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      e999Id: Sequelize.INTEGER(32),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("offer_types");
  },
};
