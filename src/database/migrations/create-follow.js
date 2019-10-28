'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('follow', {
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
            follower_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id',
                }
            },
            following_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                }
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'follow'
          });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('follow');
    }
}