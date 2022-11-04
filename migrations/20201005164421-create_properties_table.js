"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("properties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: Sequelize.STRING(100),
      description: Sequelize.TEXT,
      price: Sequelize.INTEGER(16),
      e999AdvertId: Sequelize.INTEGER,
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
      locationId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "locations",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "users",
          key: "id",
        },
      },
      mapLocationId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "map_locations",
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
    await queryInterface.dropTable("properties");
  },
};
