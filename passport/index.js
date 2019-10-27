const facebook = require('./facebook');
const kakao = require('./kakao');

module.exports = (passport, controllers) => {
  kakao(passport,controllers);
  facebook(passport, controllers);
};