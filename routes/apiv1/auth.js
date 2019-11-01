const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();
const expirationDate = '7d';

module.exports = (models, controller) => {

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    router.get('/facebook/callback', (req, res, next) => {
        passport.authenticate('facebook',
            (err, user, info) => {
                // 로그인 실패
                // 로그인 페이지로 redirect or front 에 에러 주기
                if (!user) return res.redirect('/');

                const secret = req.app.get('jwtSecret');
                const token = jwt.sign({id : user.id, nickname : user.nickname}, secret, {expiresIn : expirationDate});

                res.cookie('token', token, { domain:'.connectflavor.cf',path: '/', httpOnly: true });

                return res.redirect('/');
            }
        )(req, res, next)

    });

    router.get('/kakao', passport.authenticate('kakao', {
        session: false
    }));

    router.get('/kakao/callback', (req, res, next) => {
        passport.authenticate('kakao',
            (err, user, info) => {
                // 로그인 실패
                // 로그인 페이지로 redirect or front 에 에러 주기
                if (!user) return res.redirect('/');

                const secret = req.app.get('jwtSecret');
                const token = jwt.sign({id : user.id, nickname : user.nickname}, secret, {expiresIn : expirationDate});
                
                res.cookie('token', token, { domain:'.connectflavor.cf',path: '/', httpOnly: true });

                return res.redirect('/');
            }
        )(req, res, next)


    });
    return router
}