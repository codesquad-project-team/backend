const auth = {};
const jwt = require('jsonwebtoken')

module.exports = (models) => {
    const { User } = models;

    auth.findUser = async (provider, provided_id, email, done) => {
        const user = await User.findOrCreate({
            where: { provider, provided_id },
            defaults: { email, provider, provided_id }
        })

        if (user.length) {
            return done(null, {
                id: user[0].dataValues.id,
                nickname: user[0].dataValues.nickname,
                provider
            });
        }

        return done(null, false);
    }

    auth.login = (req, res, id, nickname, maxAge, referer) => {
        const secret = req.app.get('jwtSecret');

        const token = jwt.sign({ id, nickname }, secret, { expiresIn: `${maxAge}` });

        res.cookie('token', token, { path: '/', httpOnly: true, maxAge: maxAge });

        return res.json(JSON.stringify({referer}));
    }

    auth.tempLogin = (req, res, id, provider, maxAge, referer) => {
        const secret = req.app.get('jwtSecret');

        const tempToken = jwt.sign({ id, provider, referer }, secret, { expiresIn: `${maxAge}` });

        res.cookie('tempToken', tempToken, { path: '/', httpOnly: true, maxAge: maxAge });

        //redirect : 닉네임 입력 페이지로
        return res.redirect('http://connectflavor.cf/signup');

    }


    return auth;
}