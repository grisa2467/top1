"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.User, { through: models.UserPermission });
      Permission.hasMany(models.UserPermission);
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
    },
    {
      timestamps: false,
      tableName: "permissions",
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
