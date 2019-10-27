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

const registerNickname = (req, res, next) => {
    if (!req.decoded) return next();

    if (req.decoded.nickname) return next();

    //회원정보 입력 페이지로 redirect
    // res.redirect('/')
    res.send(req.decoded);

}

module.exports = { decodeToken, registerNickname }