"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("property_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        type: Sequelize.STRING,
      },
      optionId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "options",
          key: "id",
        },
      },
      propertyId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "properties",
          key: "id",
        },
      },
      detailId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "details",
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
    await queryInterface.dropTable("property_details");
  },
};
