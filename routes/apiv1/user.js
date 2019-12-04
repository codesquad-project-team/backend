const express = require('express');
const router = express.Router();
const createError = require('http-errors');

module.exports = (models, middlewares) => {
  const { User, Post } = models;
  const { isLoggedIn } = middlewares;
  
  router.put('/profile', isLoggedIn, async (req, res, next) => {
    const { id } = req.decoded;
    if (!id) return next(createError(401));
    const userInfo = req.body;
    const userTableAttributes = Object.keys(User.tableAttributes);
    const updatingInfoAttributes = Object.keys(userInfo);
    const unexpectedAttributes = updatingInfoAttributes.filter(key => !userTableAttributes.includes(key));
    if (unexpectedAttributes.length) return next(createError(400, "invalid attributes"));
    try {
      await User.update(userInfo, { where: { id }});
      return res.send();
    } catch (error) {
      return next(error);
    }
  });

  router.get('/myinfo', isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.decoded;
      const user = await User.findOne({
        where: { id }, 
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

  router.get('/profile-content', async (req, res, next) => {
    try {
      const userId = req.query.id;
      let isMyProfile = false;
      
      if (req.decoded) isMyProfile = req.decoded.id === userId;

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
      if(!userId) return next(createError(401));
      if(!followingId) return next(createError(400));
      const user = await User.findOne({ where: {id: userId} });
      await user.addFollowings(followingId, { timestamps: false });
      return res.send();
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/follow/:id', async (req, res, next) => {
    try {
      const userId = parseInt(req.decoded.id);
      const followingId = parseInt(req.params.id);
      if(!userId) return next(createError(401));
      if(!followingId) return next(createError(400));
      const user = await User.findOne({ where: {id: userId} });
      await user.removeFollowing(followingId);
      return res.send();
    } catch (error) {
      return next(error);
    }
  });

  return router  
}