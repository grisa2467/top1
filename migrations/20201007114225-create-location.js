"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("locations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      street: {
        type: Sequelize.STRING,
      },
      houseNr: {
        type: Sequelize.STRING,
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
      sectorId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "sectors",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("locations");
  },
};
