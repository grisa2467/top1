"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log("models in prop tp");
      // console.log(models.Property);
      // PropertyType.hasMany(models.Property, {
      //   as: "properties",
      //   foreignKey: "propertyTypeId",
      //   // through: models.Property,
      //   // as: "properties",
      //   // foreignKey: "id",
      // });
      PropertyType.hasMany(models.PropertyTypeDetail, {
        as: "propertyTypeDetails",
        foreignKey: "propertyTypeId",
      });

      PropertyType.belongsToMany(models.Detail, {
        through: models.PropertyTypeDetail,
        //   as: "details",
        foreignKey: "propertyTypeId",
      });
      // PropertyType.belongsTo(models.PropertyTypeUtilities, {
      //   as: 'propertyType',
      //   foreignKey: 'propertyTypeId'
      // })
      PropertyType.hasMany(models.PropertyTypeUtility, {
        as: "propertyTypeUtilities",
        foreignKey: "propertyTypeId",
      });
    }
  }
  PropertyType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(32),
      url: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      tableName: "property_types",
      timestamps: false,
      sequelize,
      modelName: "PropertyType",
    }
  );
  return PropertyType;
};
