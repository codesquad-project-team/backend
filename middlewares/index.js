const jwt = require('jsonwebtoken');

const middlewares = {};

middlewares.decodeToken = (req, res, next) => {
    if (!req.cookies.token) return next();

    const secret = req.app.get('jwtSecret');
    try {
        const decodedToken = jwt.verify(req.cookies.token, secret);

        req.decoded = {
            id : decodedToken.id,
            nickname : decodedToken.nickname,
            profileImage : decodedToken.profileImage
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