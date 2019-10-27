const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = (passport, controllers) => {

  passport.use(new FacebookStrategy({
    clientID: '536780433788383',
    clientSecret: '3a7e607f84dbca848549226b6105662f',
    callbackURL: "/apiv1/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
    async (accessToken, refreshToken, profile, done) => {
      const provider = 'facebook'
      const providedId = profile._json.id;
      const email = profile._json.email || null;

      try {
        controllers.auth.login(provider, providedId, email, done);

      } catch (error) {
        return done(error);
      }
    }
  ));


}  
