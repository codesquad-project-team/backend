const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const router = express.Router();

const sevenDays = 1000*60*60*24*7;
const fiveMinutes = 1000*60*5;

module.exports = (models, controller) => {
    const { User } = models;

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    router.get('/facebook/callback', (req, res, next) => {
        passport.authenticate('facebook',
            (err, user, info) => {
                const referer = req.headers.referer || 'http://connectflavor.cf'

                // 로그인 실패
                if (!user) return res.redirect(referer);

                const secret = req.app.get('jwtSecret');

                //nickname 이 없는 경우 => 회원가입
                if (!user.nickname) {
                    return controller.tempLogin(req,res,user.id, user.provider, fiveMinutes, referer);
                }

                //로그인 성공
                return controller.login(req, res, user.id, user.nickname, sevenDays, referer)
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
                    return controller.tempLogin(req,res,user.id, user.provider, fiveMinutes, referer);
                }

                //로그인 성공
                return controller.login(req, res, user.id, user.nickname, sevenDays, referer)
            }
        )(req, res, next)
    });


    router.post('/signup', async (req, res, next) => {
        // 토큰이 없는경우
        if (!req.cookies.tempToken) return next(createError(401));
        const { nickname } = req.body;

        // 닉네임이 안온경우
        if (!nickname) return next(createError(400));

        const secret = req.app.get('jwtSecret');

        try {
            const { id, referer } = jwt.verify(req.cookies.tempToken, secret);

            // id가 없는경우
            if (!id) throw "id is undefined";

            const user = await User.findOne({
                where: { id }
            })

            // user 조회 안되는경우
            if (!user) throw "user is undefined";

            // nickname 이미 있는 경우
            if (user.nickname) throw `${user.nickname} is already user`;

            await User.update({ nickname }, { where: { id } });

            //성공
            res.clearCookie('tempToken', { path: '/' });

            return controller.login(req, res, id, nickname, sevenDays, referer, 'signup')

        } catch (error) {
            // 토큰이 잘못된경우
            res.clearCookie('tempToken', { path: '/' });
            return next(createError(401));
        }
    })

    router.post('/logout', async (req, res, next) => {
        const referer = req.headers.referer || 'http://connectflavor.cf'

        res.clearCookie('token', { path: '/' });

        return res.json({ referer });
    })



    return router
}