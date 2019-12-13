const auth = {};
const jwt = require('jsonwebtoken')

module.exports = (models) => {
    const { User } = models;

    auth.findUser = async (provider, providedId, email, done) => {
        const user = await User.findOrCreate({
            where: { provider, providedId },
            defaults: { email, provider, providedId }
        })

        if (user.length) {
            return done(null, {
                id: user[0].dataValues.id,
                nickname: user[0].dataValues.nickname,
                profileImage: user[0].dataValues.profileImage,
                provider
            });
        }

        return done(null, false);
    }

    auth.login = (req, res, user, maxAge, referer, previousAction) => {
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
    }

    auth.tempLogin = (req, res, user, maxAge, referer) => {
        const secret = req.app.get('jwtSecret');

        const tempToken = jwt.sign({ 
            id : user.id, 
            provider : user.provider, 
            referer 
        }, secret, { expiresIn: `${maxAge}` });

        res.cookie('tempToken', tempToken, { path: '/', httpOnly: true, maxAge: maxAge });

        //redirect : 닉네임 입력 페이지로
        return res.redirect('http://connectflavor.cf/signup');

    }


    return auth;
}