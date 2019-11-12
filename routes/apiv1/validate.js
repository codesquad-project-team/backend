const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const spaceReg = /\s/g;

module.exports = (models, controller) => {
    const { User } = models;

    router.post('/nickname', async (req, res, next) => {
        const { nickname } = req.body;

        // 공백 있는 경우
        if (spaceReg.test(nickname)) return next(createError(400));

        // 닉네임이 없을 때
        if (!nickname) return next(createError(400));

        try {
            const user = await User.findOne({ where: { nickname } });

            // 사용 가능한 닉네임
            if (!user) return res.sendStatus(200);

            // 중복된 닉네임 
            return next(createError(409));

        } catch (error) {
            return next(createError(500));
        }
    });

    return router;
}