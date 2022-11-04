"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log("models in prop");
      // console.log(models);
      Property.belongsTo(models.PropertyType, {
        as: "propertyType",
        foreignKey: "propertyTypeId",
        // through: models.Property,
        // as: "propertyType",
        // foreignKey: "propertyTypeId",
      });
      Property.belongsTo(models.Location, {
        as: "location",
        foreignKey: "locationId",
      });
      Property.belongsTo(models.MapLocation, {
        as: "mapLocation",
        foreignKey: "mapLocationId",
      });
      Property.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });

      Property.hasMany(models.PropertyDetail, {
        as: "propertyDetails",
        foreignKey: "propertyId",
      });
      Property.hasMany(models.PropertyUtility, {
        as: "propertyUtilitiesProperty",
        foreignKey: "propertyId",
      });
      Property.belongsToMany(models.Detail, {
        through: models.PropertyDetail,
        as: "details",
        foreignKey: "propertyId",
      });
      Property.belongsToMany(models.Utility, {
        through: models.PropertyUtility,
        as: "utilities",
        foreignKey: "propertyId",
      });
      Property.hasMany(models.Photo, {
        as: "photos",
        foreignKey: "propertyId",
      });
    }
  }
  Property.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING(100),
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER(16),
      oldPrice: DataTypes.INTEGER,
      e999AdvertId: DataTypes.INTEGER,
      priority: DataTypes.BOOLEAN,
      propertyTypeId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "property_types",
          key: "id",
        },
      },
      offerTypeId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "offer_types",
          key: "id",
        },
      },
      locationId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "locations",
          key: "id",
        },
      },
      mapLocationId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "map_locations",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "properties",
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
