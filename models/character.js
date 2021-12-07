'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.character.belongsTo( models.campaign, { foreignKey: 'campaignId'});
      models.character.belongsTo( models.User, { foreignKey: 'userId'});
    }
  };
  character.init({
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    race: DataTypes.STRING,
    backstory: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'character',
  });
  return character;
};