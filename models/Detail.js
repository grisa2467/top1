"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail.hasMany(models.PropertyTypeDetail, {
        as: "propertyTypeDetails",
        foreignKey: "detailId",
      });
      Detail.hasMany(models.DetailOption, {
        as: "detailOptions",
        foreignKey: "detailId",
      });
      Detail.belongsToMany(models.Option, {
        through: models.DetailOption,
        as: "options",
        foreignKey: "detailId",
      });
      Detail.belongsToMany(models.PropertyType, {
        through: models.PropertyTypeDetail,
        foreignKey: "detailId",
      });
      Detail.hasMany(models.PropertyDetail, {
        as: "propertyDetails",
        foreignKey: "detailId",
      });
      Detail.belongsToMany(models.Property, {
        through: models.PropertyDetail,
        foreignKey: "detailId",
      });
    }
  }
  Detail.init(
    {
      name: DataTypes.STRING,
      units: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      tableName: "details",
      timestamps: false,
      sequelize,
      modelName: "Detail",
    }
  );
  return Detail;
};
