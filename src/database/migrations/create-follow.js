'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('follows', {
            followerId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id',
                }
            },
            followingId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                }
            }
        }, {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'follow',
            timestamps: false
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('follow');
    }
}