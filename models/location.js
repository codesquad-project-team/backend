'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    name: {
      type: DataTypes.STRING(45),
      allowNull : false
    },
    latitude: {
      type : DataTypes.DECIMAL(10,7),
      allowNull : false
    },
    longitude: {
      type : DataTypes.DECIMAL(10,7),
      allowNull : false
    }
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'image'
  });
  return location;
};