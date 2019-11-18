const express = require('express');
const router = express.Router();
const createError = require('http-errors');

module.exports = (models, controller) => {
  const { User, Post, sequelize } = models;
  router.get('/myinfo', async function(req, res, next) {
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

  router.get('/profile-content', async function(req, res, next) {
    try {
      const userId = req.query.id;
      const isMyProfile = false;
      if(req.decoded) isMyProfile = (req.decoded.id === userId);

      const user = await User.findOne({
        where: { id: userId },
        attributes: ['nickname', 'description', 'profile_image'],
        include: [
          { model: Post,
            attributes: ['id']
          }, {
            association: 'followers',
            attributes: ['id']
          }, {
            association: 'followings',
            attributes: ['id']
          }],
        group: ['posts.id', 'followers.id', 'followings.id']
      });

      const sendingData = {
        isMyProfile,
        "nickname": user.nickname,
        "totalPost": user.posts.length,
        "totalFollower": user.followers.length,
        "totalFollowing": user.followings.length,
        "introduction": user.description,
        "profileImage": user.profile_image
      }
      
      return res.json(sendingData);
    } catch(error) {
      return next(error);
    }
  });

  router.post('/follow/:id', async (req, res, next) => {
    try {
      const userId = parseInt(req.decoded.id);
      const followingId = parseInt(req.params.id);
      if(!followingId || !userId) return next(createError(400));
      const user = await User.findOne({ where: {id: followingId} });
      await user.addFollowing(userId);
      return res.send();
    } catch (error) {
      return next(error);
    }
  });

  return router  
}