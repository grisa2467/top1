"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyTypeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyTypeDetail.belongsTo(models.PropertyType, {
        as: "propertyTypes",
        foreignKey: "propertyTypeId",
      });

      PropertyTypeDetail.belongsTo(models.Detail, {
        as: "details",
        foreignKey: "detailId",
      });
    }
  }
  PropertyTypeDetail.init(
    {
      required: DataTypes.BOOLEAN,
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
      detailId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "details",
          key: "id",
        },
      },
    },
    {
      tableName: "property_type_details",
      timestamps: false,
      sequelize,
      modelName: "PropertyTypeDetail",
    }
  );
  return PropertyTypeDetail;
};
