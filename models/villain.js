'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class villain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.villain.belongsTo( models.campaign, { foreignKey: 'campaignId'});
    }
  };
  villain.init({
    name: DataTypes.STRING,
    goal: DataTypes.STRING,
    plan: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'villain',
  });
  return villain;
};