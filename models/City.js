"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      City.hasMany(models.RegionCity, {
        as: 'cities',
        foreignKey: 'cityId'
      })
      City.belongsToMany(models.Region, {through: models.RegionCity, as: 'regions', foreignKey: 'cityId'})

      City.hasMany(models.CitySectors, {
        as: 'citiesS',
        foreignKey: 'cityId'
      })
      City.belongsToMany(models.Sector, {through: models.CitySectors, as: 'sectors', foreignKey: 'cityId'})
    }
  }
  City.init(
    {
      name: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      timestamps: false,
      tableName: "cities",
      sequelize,
      modelName: "City",
    }
  );
  return City;
};
