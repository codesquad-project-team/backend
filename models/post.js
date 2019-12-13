'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      type: DataTypes.INTEGER,
    },
    titleLocation: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    titleCompanion: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    titleActivity: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'post'
  });
  return post;
};