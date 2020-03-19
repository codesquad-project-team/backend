const jwt = require('jsonwebtoken');

const middlewares = {};

middlewares.renewToken = (req, res, next) => {
    if (!req.decoded) return next();

    const restDays = (req.decoded.exp * 1000 - Date.now()) / (1000 * 60 * 60 * 24);
    if (restDays > 1) return next();

    const secret = req.app.get('jwtSecret');
    const sevenDays = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign({
        id: req.decoded.id,
        nickname: req.decoded.nickname,
        profileImage: req.decoded.profileImage
    }, secret, { expiresIn: `${sevenDays}` });

    res.cookie('token', token, { path: '/', httpOnly: true, maxAge: sevenDays, sameSite: "None" });

    return next();
}

middlewares.decodeToken = (req, res, next) => {
    if (!req.cookies.token) return next();

    const secret = req.app.get('jwtSecret');
    try {
        const decodedToken = jwt.verify(req.cookies.token, secret);

        req.decoded = {
            id: decodedToken.id,
            nickname: decodedToken.nickname,
            profileImage: decodedToken.profileImage,
            exp: decodedToken.exp
        }

    } catch (error) {
        res.clearCookie('token', { path: '/' });
    }
    return next();
}

middlewares.isLoggedIn = (req, res, next) => {
    if (req.decoded) return next();

    res.status(401);
    return res.send('Unauthorized');
}

module.exports = middlewares