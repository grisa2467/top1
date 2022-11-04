"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CitySectors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CitySectors.belongsTo(models.City, {as: 'citiesS', foreignKey: 'cityId'})
      CitySectors.belongsTo(models.Sector, {as: 'sectors', foreignKey: 'sectorId'})
    }
  }
  CitySectors.init(
    {
      cityId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "cities",
          key: "id",
        },
      },
      sectorId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "sectors",
          key: "id",
        },
      },
    },
    {
      tableName: "city_sectors",
      timestamps: false,
      sequelize,
      modelName: "CitySectors",
    }
  );
  return CitySectors;
};
