"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.hasOne(models.Property, {
        as: "property",
        foreignKey: "locationId",
      });
      Location.belongsTo(models.Region, {
        as: "region",
        foreignKey: "regionId",
      });
      Location.belongsTo(models.City, {
        as: "city",
        foreignKey: "cityId",
      });
      Location.belongsTo(models.Sector, {
        as: "sector",
        foreignKey: "sectorId",
      });
    }
  }
  Location.init(
    {
      street: DataTypes.STRING,
      houseNr: DataTypes.STRING,

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
      sectorId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "sectors",
          key: "id",
        },
      },
    },
    {
      tableName: "locations",
      sequelize,
      modelName: "Location",
    }
  );
  return Location;
};
