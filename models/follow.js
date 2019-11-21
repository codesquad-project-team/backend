'use strict';
module.exports = (sequelize, DataTypes) => {
    const follow = sequelize.define('follow', {
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        modelName: 'follow'
    });
    return follow;
};