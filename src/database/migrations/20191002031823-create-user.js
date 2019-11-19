'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      nickname: {
        type: Sequelize.STRING(45),
        allowNull: true,
        unique: true
      },
      provider: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      provided_id: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      description: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      authority: {
        type: Sequelize.STRING(45),
        allowNull: false,
        defaultValue: 'normal'
      }
    }, {
      timestamps: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      modelName: 'user'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};