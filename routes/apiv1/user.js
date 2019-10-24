const express = require('express');
const router = express.Router();
const createError = require('http-errors');

module.exports = (models, controller) => {
  const { User } = models;
  router.get('/info', async function(req, res, next) {
    try {
      const userId = 3;
      const user = await User.findOne({
        where: { id: userId }, 
        attributes: { exclude: ['authority']}
      });
      if(user === null) return next(createError(500));
      const userInfo = {
        id: user.id,
        profileImage: user.profile_image,
        email: user.email,
        phone: user.phone,
        nickname: user.nickname,
        description: user.description
      }
      return res.json(userInfo);
    } catch(error) {
      return next(error);
    }
  });
  return router  
}