"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegionCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RegionCity.belongsTo(models.Region,  {
        as:'regions',
        foreignKey: 'regionId'
      })
      RegionCity.belongsTo(models.City,  {
        as:'cities',
        foreignKey: 'cityId'
      })
      
    }
  }
  RegionCity.init(
    {
      regionId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "regions",
          key: "id",
        },
      },
      cityId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "cities",
          key: "id",
        },
      },
    },
    {
      tableName: "region_cities",
      timestamps: false,
      sequelize,
      modelName: "RegionCity",
    }
  );
  return RegionCity;
};
