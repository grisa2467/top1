"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sector.hasMany(models.CitySectors, {
        as: 'sectors',
        foreignKey: 'sectorId'
      })
      Sector.belongsToMany(models.City, {through: models.CitySectors, as:'cities', foreignKey:'sectorId'})
    }
  }
  Sector.init(
    {
      name: DataTypes.STRING,
      e999Id: DataTypes.INTEGER(32),
    },
    {
      timestamps: false,
      tableName: "sectors",
      sequelize,
      modelName: "Sector",
    }
  );
  return Sector;
};
