'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.story.belongsTo( models.campaign, { foreignKey: 'campaignId'});
    }
  };
  story.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    timeFrame: DataTypes.STRING,
    storyBeats: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'story',
  });
  return story;
};