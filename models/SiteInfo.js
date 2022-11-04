"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SiteInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  SiteInfo.init(
    {
      description: DataTypes.STRING,
      id: {
        primaryKey: true,
        type: DataTypes.STRING(32),
      },
    },
    {
      timestamps: false,
      tableName: "site_info",
      sequelize,
      modelName: "SiteInfo",
    }
  );
  return SiteInfo;
};
