/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 인증과 관련된 것들.
 */

/**
 * @swagger
 * /auth/kakao:
 *  get:
 *   tags:
 *   - "auth"
 *   summary: "kakao OAuth 로그인"
 *   description: "유저 승인시 /auth/kakao/callback 으로 redirect."
 *   produces:
 *   - "application/json"
 *   responses:
 *    301:
 *     description: "/auth/kakao/callback 으로 이동"
 * /auth/kakao/callback:
 *  get:
 *   tags:
 *   - "auth"
 *   summary: "kakao OAuth 로그인"
 *   description: "kakao 에서 받은 정보로 로그인\n성공시 : 쿠키에 토큰 발급, 이전페이지로 이동\n실패시 : 이전 주소로 redirect\n회원가입필요시 : 임시 토큰 쿠키에 발급, 회원가입 페이지로 이동"
 *   produces:
 *   - "application/json"
 *   responses:
 *    302:
 *     description: "이전 페이지로 이동\n회원가입 페이지로 이동"
 * /auth/signup:
 *  post:
 *   tags:
 *   - "auth"
 *   summary: "nickname post, 회원가입"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n닉네임 입력하고 회원가입한다."
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "nickname"
 *     description: "회원가입하는 nickname"
 *     required: true
 *   responses:
 *    200:
 *     description: "회원가입 성공\n토큰발급\n리다이렉트 할  referer 를 응답"
 *     schema:
 *      $ref: "#definitions/referer"
 *    400:
 *     description: "nickname 이 없음"
 *    401:
 *     description: "유효하지 않은 token"        
 * /auth/tempToken:
 *  post:
 *   tags:
 *   - "auth"
 *   summary: "임시토큰 검증"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n임시토큰을 검증한다"
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   responses:
 *    200:
 *     description: "검증된 토큰"
 *     schema:
 *      $ref: "#definitions/provider"
 *    401:
 *     description: "유효하지 않은 token"          
 * /auth/logout:
 *  post:
 *   tags:
 *   - "auth"
 *   summary: "로그아웃"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n토큰삭제하고 유저를 로그아웃 시킨다."
 *   prodeces:
 *   - "application/json"
 *   responses:
 *    200:
 *     description: "로그아웃성공\n리다이렉트 할  referer 를 응답"
 *     schema:
 *      $ref: "#definitions/referer"
 * /auth/has-logged-in:
 *  get:
 *   tags:
 *   - "auth"
 *   summary: "로그인 확인"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n로그인 여부를 확인하고, 로그인 시 id, nickname, profileImage를 응답한다."
 *   prodeces:
 *   - "application/json"
 *   responses:
 *    200:
 *     description: "로그인 상태\nid, nickname, profileImage를 준다"
 *     schema:
 *      $ref: "#definitions/tokenInfo"
 *    401:
 *     description: "로그인 상태가 아님"
 */

/**
 * @swagger
 * definitions:
 *  referer:
 *   type: "object"
 *   properties:
 *    referer:
 *     type: "string"
 *  provider:
 *   type: "object"
 *   properties:
 *    provider:
 *     type: "string"
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = (models, middlewares) => {
    const { isLoggedIn } = middlewares;
    const {
        facebookCallback,
        kakaoCallback,
        signup,
        logout,
        checkTempToken,
     } =  require('./auth-ctrl')(models);

    router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    router.get('/facebook/callback', facebookCallback);
    router.get('/kakao', passport.authenticate('kakao', { session: false }));
    router.get('/kakao/callback', kakaoCallback);
    router.post('/signup', signup);
    router.post('/logout', logout);
    router.get('/has-logged-in', isLoggedIn, (req, res, next) => res.json(req.decoded));
    router.post('/tempToken', checkTempToken);
    
    return router;
};