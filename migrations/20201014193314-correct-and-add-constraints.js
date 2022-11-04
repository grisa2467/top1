"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //on delete properties
    //delete photos
    await queryInterface.addConstraint("photos", {
      type: "foreign key",
      fields: ["propertyId"],
      references: {
        table: "properties",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    //delete property_utilities
    await queryInterface.addConstraint("property_utilities", {
      type: "foreign key",
      fields: ["propertyId"],
      references: {
        table: "properties",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    //delete property_details
    await queryInterface.addConstraint("property_details", {
      type: "foreign key",
      fields: ["propertyId"],
      references: {
        table: "properties",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    //ondelete groups
    await queryInterface.addConstraint("users", {
      type: "foreign key",
      fields: ["groupId"],
      references: {
        table: "groups",
        field: "id",
      },
      onDelete: "set null",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
