const createError = require('http-errors');

module.exports = (models) => {
  const controller = {};
  const { User, Post } = models;

  controller.updateUserProfile = async (req, res, next) => {
    const { id } = req.decoded;

    if (!id) return next(createError(401));

    const userInfo = req.body;
    const userTableAttributes = Object.keys(User.tableAttributes);
    const updatingInfoAttributes = Object.keys(userInfo);
    const unexpectedAttributes = updatingInfoAttributes.filter(
      key => !userTableAttributes.includes(key)
    );
    if (unexpectedAttributes.length) return next(createError(400, "invalid attributes"));
    
    try {
      // returning option으로 update 후의 객체를 받아오려고 했으나 postgre에서만 지원한다고함.
      await User.update(userInfo, {
        where: { id },
      });

      const user = await User.findOne({ where: { id } });

      // 프로필 수정 후 수정된 정보로 token 재발급
      // token 발급 미들웨어를 만드는건 어떨까.
      const jwt = require('jsonwebtoken');
      const tokenMaxAge = 1000*60*60*24*7;
      const secret = req.app.get('jwtSecret');
      const tokenInfo = {
          id: user.id,
          nickname : user.nickname,
          profileImage : user.profileImage
      }
      const token = jwt.sign(tokenInfo, secret, { expiresIn: `${tokenMaxAge}` });

      res.cookie('token', token, { path: '/', httpOnly: true, maxAge: tokenMaxAge });
    
      return res.send();
    } catch (error) {
      return next(error);
    }
  };

  controller.getMyInfo = async (req, res, next) => {
    try {
      const { id } = req.decoded;
      const { profileImage, email, phone, nickname, introduction } = await User.findOne({
        where: { id }, 
        attributes: { exclude: ['authority']}
      });
      if(nickname === null) return next(createError(500));
      const userInfo = { id, profileImage, email, phone, nickname, introduction };

      return res.json(userInfo);
    } catch(error) {
      return next(error);
    }
  };

  controller.getProfileContent = async (req, res, next) => {
    try {
      const { id: idInQuery, nickname: nicknameInQuery } = req.query;
      
      if (!idInQuery && !nicknameInQuery) {
        return next(createError(400, "id or nickname required"));
      }

      // id, nickname 둘 다 있으면 id로 찾는다.
      const where = idInQuery ? { id: idInQuery } : { nickname: nicknameInQuery };

      let isFollowing = false;
      
      const { id, nickname, posts, followers, followings, introduction, profileImage } =
        await User.findOne({
          where,
          attributes: ['nickname', 'introduction', 'profileImage', 'id'],
          include: [
            { model: Post,
              attributes: ['id'],
            }, {
              association: 'followers',
              attributes: ['id'],
            }, {
              association: 'followings',
              attributes: ['id'],
            }],
          group: ['posts.id', 'followers.id', 'followings.id']
        });

      if(req.decoded) {
        isFollowing = followers.filter(
          user => user.id === req.decoded.id
        ).length !== 0;
      }

      const sendingData = {
        id,
        isFollowing,
        nickname,
        introduction,
        profileImage,
        totalPosts: posts.length,
        totalFollowers: followers.length,
        totalFollowings: followings.length,
      };

      return res.json(sendingData);
    } catch(error) {
      return next(error);
    }
  };

  controller.addFollow = async (req, res, next) => {
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
  };

  controller.removeFollow = async (req, res, next) => {
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
  };

  controller.checkNicknameDuplication = async (req, res, next) => {
    const spaceReg = /\s/g;
    const { nickname } = req.body;
    // 공백 있는 경우
    if (spaceReg.test(nickname)) return next(createError(400));
    // 닉네임이 없을 때
    if (!nickname) return next(createError(400));
    try {
      const user = await User.findOne({ where: { nickname } });
      // 사용 가능한 닉네임
      if (!user) return res.sendStatus(200);
      // 중복된 닉네임 
      return next(createError(409));
    } catch (error) {
      return next(createError(500));
    }
  };

  return controller;
};