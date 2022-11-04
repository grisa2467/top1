"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PropertyDetail.belongsTo(models.Property, {
        as: "propertys",
        foreignKey: "propertyId",
      });

      PropertyDetail.belongsTo(models.Detail, {
        as: "details",
        foreignKey: "detailId",
      });
      PropertyDetail.belongsTo(models.Option, {
        as: "optionValue",
        foreignKey: "optionId",
      });
    }
  }
  PropertyDetail.init(
    {
      value: DataTypes.STRING,
      optionId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "options",
          key: "id",
        },
      },
      propertyId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "properties",
          key: "id",
        },
      },
      detailId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "details",
          key: "id",
        },
      },
    },
    {
      tableName: "property_details",
      sequelize,
      modelName: "PropertyDetail",
    }
  );
  return PropertyDetail;
};
