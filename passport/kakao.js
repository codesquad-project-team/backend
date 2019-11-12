const kakaoStrategy = require('passport-kakao').Strategy;
require('dotenv').config();

module.exports = (passport, controllers) => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "http://api.connectflavor.cf/v1/auth/kakao/callback",
    },
        async (accessToken, refreshToken, profile, done) => {
            const provider = 'kakao';
            const providedId = profile.id;
            const email = profile._json.kakao_account.email || null;

            try {
                controllers.auth.login(provider, providedId, email, done);

            } catch (error) {
                return done(error);
            }
        }
    ));


}  
