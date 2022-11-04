"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Region.hasMany(models.RegionCity, {
        as: 'regions',
        foreignKey: 'regionId'
      })
      Region.belongsToMany(models.City, {through: models.RegionCity, as: 'cities', foreignKey: 'regionId'})
    }
  }
  Region.init(
    {
      name: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      timestamps: false,
      tableName: "regions",
      sequelize,
      modelName: "Region",
    }
  );
  return Region;
};
