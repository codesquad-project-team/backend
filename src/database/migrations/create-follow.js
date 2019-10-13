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
            follower_email: {
                allowNull: false,
                type: Sequelize.STRING(64),
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'email',
                }
            },
            following_email: {
                allowNull: false,
                type: Sequelize.STRING(64),
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'email'
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