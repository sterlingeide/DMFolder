'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class majorFaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.majorFaction.belongsTo( models.campaign, { foreignKey: 'campaignId'});
    }
  };
  majorFaction.init({
    name: DataTypes.STRING,
    leader: DataTypes.STRING,
    size: DataTypes.STRING,
    location: DataTypes.STRING,
    agenda: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'majorFaction',
  });
  return majorFaction;
};