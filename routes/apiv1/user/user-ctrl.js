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

      res.cookie('token', token, { path: '/', httpOnly: true, maxAge: tokenMaxAge, sameSite: "None" });
    
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
      const { id, nickname } = req.query;
      
      if (!id && !nickname) {
        return next(createError(400, "id or nickname required"));
      }

      // id, nickname 둘 다 있으면 id로 찾는다.
      const where = id ? { id } : { nickname };

      let isFollowing = false;
      
      const user =
        await User.findOne({
          where,
          attributes: ['id', 'nickname', 'introduction', 'profileImage'],
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
      
      if (!user) return res.status(204).send("no user");

      if (req.decoded) {
        isFollowing = user.followers.filter(
          follower => follower.id === req.decoded.id
        ).length !== 0;
      }

      const sendingData = {
        id: user.id,
        isFollowing,
        nickname: user.nickname,
        introduction: user.introduction,
        profileImage: user.profileImage,
        totalPosts: user.posts.length,
        totalFollowers: user.followers.length,
        totalFollowings: user.followings.length,
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

  controller.getRelationship = async (req, res, next) => {
    const { id, type } = req.params;
    
    if(!id || !type) return next(createError(400, 'user id, type required'));

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) return next(createError(400, 'no user'));

      let users;
      switch (type) {
        case 'follower':
          users = await user.getFollowers({ attributes: ['id', 'nickname', 'profileImage'] });
          break;
        case 'following':
          users = await user.getFollowings({ attributes: ['id', 'nickname', 'profileImage'] });
          break;
        default:
          return next(createError(400, 'type should be followers or followings'));
      }
      
      const responseData = users.map(({ id, nickname, profileImage }) => {
        return { id, nickname, profileImage }
      });

      return res.json(responseData);
    } catch(error) {
      return next(error);
    }
  };

  return controller;
};