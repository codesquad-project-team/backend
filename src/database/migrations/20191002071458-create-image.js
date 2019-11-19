'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique : true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull : false
      },
      post_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'posts'
          },
          key: 'id',
        }
      },
      is_representative: {
        type : Sequelize.BOOLEAN,
        default: false,
        allowNull : false
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
      modelName: 'image'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('images');
  }
};