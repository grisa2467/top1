"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Permission, { through: models.UserPermission });
      User.hasMany(models.UserPermission);
      User.hasMany(models.Property, {
        as: "properties",
        foreignKey: "userId",
      });
      User.belongsTo(models.Group, {
        as: "group",
        foreignKey: "groupId",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      givenName: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      familyName: {
        type: DataTypes.STRING,
      },
      e999Token: DataTypes.STRING,
      tel: DataTypes.STRING,
      password: DataTypes.STRING,
      groupId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "groups",
          key: "id",
        },
      },
    },
    {
      tableName: "users",
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
