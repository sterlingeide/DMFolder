'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.lore.belongsTo( models.campaign, { foreignKey: 'campaignId'});
    }
  };
  lore.init({
    history: DataTypes.STRING,
    religion: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'lore',
  });
  return lore;
};