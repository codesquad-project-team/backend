const passport = require('passport');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const sevenDays = 1000*60*60*24*7;
const fiveMinutes = 1000*60*5;
const tokenMaxAge = sevenDays;
const tempTokenMaxAge = fiveMinutes;

module.exports = (models) => {
  const controller = {};
  const { User } = models;

  controller.facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', defineNextProcess(req, res))(req, res, next);
  };
  
  controller.kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', defineNextProcess(req, res))(req, res, next);
  };

  controller.signup = async (req, res, next) => {
    // 토큰이 없는경우
    if (!req.cookies.tempToken) return next(createError(401));
    const { nickname } = req.body;
    // 닉네임이 안온경우
    if (!nickname) return next(createError(400));
    const secret = req.app.get('jwtSecret');
    try {
      const { id, referer } = jwt.verify(req.cookies.tempToken, secret);
      // id가 없는경우
      if (!id) throw "id is undefined";
      const user = await User.findOne({
          where: { id }
      })
      // user 조회 안되는경우
      if (!user) throw "user is undefined";
      // nickname 이미 있는 경우
      if (user.nickname) throw `${user.nickname} is already user`;
      await User.update({ nickname }, { where: { id } });
      //성공
      res.clearCookie('tempToken', { path: '/' });
      const userInfo = {
          id: id,
          nickname: nickname,
          profileImage: user.dataValues.profileImage,
      }

      return login(req, res, userInfo, tokenMaxAge, referer, 'signup')
    } catch (error) {
      // 토큰이 잘못된경우
      res.clearCookie('tempToken', { path: '/' });
      return next(createError(401));
    }
  };

  controller.logout = async (req, res, next) => {
    const referer = req.headers.referer || 'http://connectflavor.cf'
    res.clearCookie('token', { path: '/' });

    return res.json({ referer });
  };
  
  controller.checkTempToken = async (req, res, next) => {
    // 토큰 없는 경우
    if (!req.cookies.tempToken) return next(createError(401));
    try {
      const secret = req.app.get('jwtSecret');
      const { id, provider } = jwt.verify(req.cookies.tempToken, secret);
      // id가 없는경우
      if (!id) throw "id is undefined";
      
      return res.json({ provider });
    } catch (error) {
      // 토큰이 잘못된경우
      res.clearCookie('tempToken', { path: '/' });
      
      return next(createError(401));
    }
  };

  const login = (req, res, user, maxAge, referer, previousAction) => {
    const secret = req.app.get('jwtSecret');
    const userInfo = {
        id : user.id,
        nickname : user.nickname,
        profileImage : user.profileImage
    }
    const token = jwt.sign(userInfo, secret, { expiresIn: `${maxAge}` });
    res.cookie('token', token, { path: '/', httpOnly: true, maxAge: maxAge });
  
    if (previousAction === 'signup') {
        return res.json({ referer });
    }
  
    return res.redirect(referer);
  };
  
  const tempLogin = (req, res, user, maxAge, referer) => {
    const secret = req.app.get('jwtSecret');
    const tempToken = jwt.sign({ 
        id : user.id, 
        provider : user.provider, 
        referer 
    }, secret, { expiresIn: `${maxAge}` });
    res.cookie('tempToken', tempToken, { path: '/', httpOnly: true, maxAge: maxAge });

    //redirect : 닉네임 입력 페이지로
    return res.redirect('http://connectflavor.cf/signup');
  };

  const defineNextProcess = (req, res) => {
    return (err, user, info) => {
      const referer = req.headers.referer || 'http://connectflavor.cf';
      // 로그인 실패
      if (!user) return res.redirect(referer);

      //nickname 이 없는 경우 => 회원가입
      if (!user.nickname) {
          return tempLogin(req, res, user, tempTokenMaxAge, referer);
      }

      //로그인 성공
      return login(req, res, user, tokenMaxAge, referer)
    }
  }
  return controller;
};