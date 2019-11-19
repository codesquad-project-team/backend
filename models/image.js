'use strict';
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define('image', {
    url: {
      type : DataTypes.STRING(255),
      allowNull : false
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      type: DataTypes.INTEGER
    },
    is_representative: {
      type : DataTypes.BOOLEAN,
      default: false,
      allowNull : false
    },
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'image'
  });
  return image;
};