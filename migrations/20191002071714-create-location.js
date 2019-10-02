'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique : true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull : false
      },
      latitude: {
        type : Sequelize.DECIMAL(10,7),
        allowNull : false
      },
      longitude: {
        type : Sequelize.DECIMAL(10,7),
        allowNull : false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('locations');
  }
};