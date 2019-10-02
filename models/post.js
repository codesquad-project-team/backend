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
    writer: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    title_place: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    title_companion: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    title_activity: {
      type: DataTypes.STRING(45),
      allowNull: false
    }, description: {
      type: DataTypes.BLOB(2400),
      allowNull: true
    }
  }, {
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'post'
  });
  return post;
};