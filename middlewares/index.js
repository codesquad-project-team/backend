const jwt = require('jsonwebtoken');

const decodeToken = (req, res, next) => {
    if (!req.cookies.token) return next();

    const secret = req.app.get('jwtSecret');
    try {
        req.decoded = jwt.verify(req.cookies.token, secret);
    } catch (error) {
        res.clearCookie('token', { path: '/' });
    }
    return next();
}

module.exports = { decodeToken }