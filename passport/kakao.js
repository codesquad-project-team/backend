const kakaoStrategy = require('passport-kakao').Strategy;

module.exports = (passport, controllers) => {
    passport.use(new kakaoStrategy({
        clientID: '807dcd6935b69459079b2fc6126a39b1',
        callbackURL: '/apiv1/auth/kakao/callback'
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
