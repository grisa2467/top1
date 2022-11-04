"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Photo.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      url: DataTypes.STRING,
      order: DataTypes.INTEGER,
      propertyId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "properties",
          key: "id",
        },
      },
    },
    {
      tableName: "photos",
      sequelize,
      modelName: "Photo",
    }
  );
  return Photo;
};
