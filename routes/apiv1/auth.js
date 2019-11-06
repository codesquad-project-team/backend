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
                where: { id: postId }
            })

            // user 조회 안되는경우
            if (!user) throw "user is undefined";

            // nickname 이미 있는 경우
            if (user.nickname) throw `${user.nickname} is already user`;

            await User.update({ nickname }, { where: { id } });

            //성공
            res.clearCookie('tempToken', { path: '/' });

            const token = jwt.sign({ id: user.id, nickname: user.nickname }, secret, { expiresIn: expirationDate });

            res.cookie('token', token, { domain: '.connectflavor.cf', path: '/', httpOnly: true });

            return res.redirect(referer);

        } catch (error) {
            // 토큰이 잘못된경우
            res.clearCookie('tempToken', { path: '/' });
            return next(createError(401));
        }
    })


    return router
}