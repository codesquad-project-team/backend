'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      title_companion: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      title_activity: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      description: {
        type: Sequelize.BLOB,
        allowNull: true
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
      writer_id: {
        allowNull: false,
        type: Sequelize.STRING(64),
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id',
        },
      },
      location_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'locations'
          },
          key: 'id',
        },
      }
    }, {
      timestamps: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      modelName: 'post'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  }
};