"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Utility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Utility.hasMany(models.PropertyUtility, {
        as: "propertyUtilitiesUtility",
        foreignKey: "utilityId",
      });
      Utility.belongsToMany(models.Property, {
        through: models.PropertyUtility,
        as: "properties",
        foreignKey: "utilityId",
      });
    }
  }
  Utility.init(
    {
      name: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      tableName: "utilities",
      timestamps: false,
      sequelize,
      modelName: "Utility",
    }
  );
  return Utility;
};
