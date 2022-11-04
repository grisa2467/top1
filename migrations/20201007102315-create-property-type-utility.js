"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("property_type_utilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      propertyTypeId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "property_types",
          key: "id",
        },
      },
      offerTypeId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "offer_types",
          key: "id",
        },
      },
      utilityId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "utilities",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("property_type_utilities");
  },
};
