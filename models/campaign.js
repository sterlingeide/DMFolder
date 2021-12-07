'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.campaign.belongsTo( models.User, { foreignKey: 'userId'});
      models.campaign.hasMany(models.character, { foreignKey: 'campaignId'});
      models.campaign.hasMany(models.location, { foreignKey: 'campaignId'});
      models.campaign.hasMany(models.lore, { foreignKey: 'campaignId'});
      models.campaign.hasMany(models.majorFaction, { foreignKey: 'campaignId'});
      models.campaign.hasMany(models.story, { foreignKey: 'campaignId'});
      models.campaign.hasMany(models.villain, { foreignKey: 'campaignId'});
    }
  };
  campaign.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'campaign',
  });
  return campaign;
};