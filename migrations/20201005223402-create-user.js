"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      groupId: {
        type: Sequelize.INTEGER,
        reference: {
          model: "groups",
          key: "id",
        },
      },
      givenName: {
        type: Sequelize.STRING,
      },
      familyName: {
        type: Sequelize.STRING,
      },
      e999Token: Sequelize.STRING,
      tel: Sequelize.STRING,
      password: Sequelize.STRING,
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
    await queryInterface.dropTable("users");
  },
};
