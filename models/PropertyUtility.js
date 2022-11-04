"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyUtility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PropertyUtility.belongsTo(models.Property, {
        as: "propertys",
        foreignKey: "propertyId",
      });

      PropertyUtility.belongsTo(models.Utility, {
        as: "utilities",
        foreignKey: "utilityId",
      });
    }
  }
  PropertyUtility.init(
    {
      propertyId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "properties",
          key: "id",
        },
      },
      utilityId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "utilities",
          key: "id",
        },
      },
    },
    {
      tableName: "property_utilities",
      sequelize,
      modelName: "PropertyUtility",
    }
  );
  return PropertyUtility;
};
