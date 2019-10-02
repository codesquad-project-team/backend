'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
      authority: {
        type: Sequelize.STRING(45),
        allowNull: false,
        defaultValue: 'normal'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};