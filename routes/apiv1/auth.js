const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const router = express.Router();

const expirationDate = '7d';
const twoMin = 5*60*1000;

module.exports = (models, controller) => {
    const { User } = models;

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
                const referer = req.headers.referer || 'http://connectflavor.cf'

                // 로그인 실패
                if (!user) return res.redirect(referer);

                const secret = req.app.get('jwtSecret');

                //nickname 이 없는 경우 => 회원가입
                if (!user.nickname) {
                    const tempToken = jwt.sign({ id: user.id, referer }, secret, { expiresIn: '5m' });

                    res.cookie('tempToken', tempToken, { domain: '.connectflavor.cf', path: '/', httpOnly: true, maxAge: twoMin });

                    //redirect : 닉네임 입력 페이지로
                    return res.redirect('http://connectflavor.cf/signup');
                }

                //로그인 성공
                const token = jwt.sign({ id: user.id, nickname: user.nickname }, secret, { expiresIn: expirationDate });

                res.cookie('token', token, { domain: '.connectflavor.cf', path: '/', httpOnly: true });

                return res.redirect(referer);
            }
        )(req, res, next)
    });

    return router
}