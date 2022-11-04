"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyTypeUtility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyTypeUtility.belongsTo(models.PropertyType, {
        as: "propertyTypes",
        foreignKey: "propertyTypeId",
      });

      PropertyTypeUtility.belongsTo(models.Utility, {
        as: "utilities",
        foreignKey: "utilityId",
      });
    }
  }
  PropertyTypeUtility.init(
    {
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
      utilityId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "utilities",
          key: "id",
        },
      },
    },
    {
      tableName: "property_type_utilities",
      timestamps: false,
      sequelize,
      modelName: "PropertyTypeUtility",
    }
  );
  return PropertyTypeUtility;
};
