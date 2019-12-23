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
      profileImage: {
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
      providedId: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      introduction: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      authority: {
        type: Sequelize.STRING(45),
        allowNull: false,
        defaultValue: 'normal'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
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