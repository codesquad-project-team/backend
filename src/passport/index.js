const kakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = (passport, models) => {
  const { User } = models;

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://api.connectflavor.cf/v1/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
      const provider = 'facebook'
      const providedId = profile._json.id;
      const email = profile._json.email || null;
      try {
        findUser(provider, providedId, email, done);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use(new kakaoStrategy({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: "http://api.connectflavor.cf/v1/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const provider = 'kakao';
      const providedId = profile.id;
      const email = profile._json.kakao_account.email || null;
      try {
        findUser(provider, providedId, email, done);
      } catch (error) {
        return done(error);
      }
    }
  ));

  const findUser = async (provider, providedId, email, done) => {
    const user = await User.findOrCreate({
      where: {
        provider,
        providedId
      },
      defaults: {
        email,
        provider,
        providedId
      }
    });

    if (user.length) {
      return done(null, {
        id: user[0].dataValues.id,
        nickname: user[0].dataValues.nickname,
        profileImage: user[0].dataValues.profileImage,
        provider
      });
    }

    return done(null, false);
  };
};