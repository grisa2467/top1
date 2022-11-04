"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Option.hasMany(models.DetailOption, {
        as: "detailOptions",
        foreignKey: "optionId",
      });
      Option.belongsToMany(models.Detail, {
        through: models.DetailOption,
        // as: "options",
        foreignKey: "optionId",
      });
    }
  }
  Option.init(
    {
      name: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      tableName: "options",
      timestamps: false,
      sequelize,
      modelName: "Option",
    }
  );
  return Option;
};
