"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("property_type_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      required: {
        type: Sequelize.BOOLEAN,
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
      detailId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "details",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("property_type_details");
  },
};
