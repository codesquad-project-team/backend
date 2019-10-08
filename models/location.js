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
    },
    address: {
      type : DataTypes.STRING(100),
      allowNull : false
    },
    link: {
      type : DataTypes.STRING(255),
      allowNull : true
    },
    phone: {
      type : DataTypes.STRING(45),
      allowNull : true
    }
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'location'
  });
  return location;
};