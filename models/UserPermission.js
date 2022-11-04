"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPermissions.belongsTo(models.User);
      UserPermissions.belongsTo(models.Permission);
    }
  }
  UserPermissions.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.STRING,
      permissionId: DataTypes.STRING,
    },
    {
      tableName: "user_permissions",
      sequelize,
      modelName: "UserPermission",
    }
  );
  return UserPermissions;
};
