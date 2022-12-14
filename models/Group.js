"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.User, {
        as: "users",
        foreignKey: "groupId",
      });
    }
  }
  Group.init(
    {
      e999Token: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      tableName: "groups",
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
