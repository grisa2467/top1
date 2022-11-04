"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailOption.belongsTo(models.Detail, {
        as: "details",
        foreignKey: "detailId",
      });
      DetailOption.belongsTo(models.Option, {
        as: "options",
        foreignKey: "optionId",
      });
    }
  }
  DetailOption.init(
    {
      detailId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "details",
          key: "id",
        },
      },
      optionId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "options",
          key: "id",
        },
      },
    },
    {
      tableName: "detail_options",
      timestamps: false,
      sequelize,
      modelName: "DetailOption",
    }
  );
  return DetailOption;
};
