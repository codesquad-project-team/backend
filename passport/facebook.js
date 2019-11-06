const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

module.exports = (passport, controllers) => {

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
        controllers.auth.login(provider, providedId, email, done);

      } catch (error) {
        return done(error);
      }
    }
  ));


}  
