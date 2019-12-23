'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { User } = require('../../../models');
    require('lodash.combinations')
    const _ = require('lodash');
    
    const users = await User.findAll({
      attributes: ['id'],
    });
    
    const userIds = users.reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.dataValues.id);
      return accumulator;
    }, []);

    const IdCombinations = _.combinations(userIds, 2);
    const IdTotalCombinations = IdCombinations.reduce((accumulator, currentValue) => {
      const indexReversedArray = [currentValue[1], currentValue[0]];
      accumulator.push(currentValue, indexReversedArray);
      return accumulator;
    }, []);

    const shuffledIdCombinations = shuffle(IdTotalCombinations);
    const follow = shuffledIdCombinations.slice(-Math.floor(shuffledIdCombinations.length*0.6));
    const bulkFollowData = [];
    follow.forEach(element => {
      const record = {
        followerId: element[0],
        followingId: element[1]
      }
      return bulkFollowData.push(record);
    });

    await queryInterface.bulkInsert('follows', bulkFollowData, {});
    return;
  },

  down: (queryInterface, Sequelize) => {
  }
};

function shuffle(array) {
  let m = array.length, t, i;
  while (m) {  
    i = Math.floor(Math.random() * m--);  
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}