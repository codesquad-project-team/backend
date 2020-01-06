/**
 * @swagger
 * tags:
 *   name: user
 *   description: 회원 정보와 관련된 것들.
 */

/**
 * @swagger
 * /user/profile:
 *  put:
 *   tags:
 *   - "user"
 *   summary: "user 정보 업데이트"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**"
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   - in: "body"
 *     name: "userInfo"
 *     description: "update 할 유저 정보"
 *     required: true
 *     schema:
 *      $ref: "#definitions/userInfo"
 *   responses:
 *    200:
 *     description: "Success"
 *    401:
 *     description: "unauthorized"
 *    400:
 *     description: "bad request, params 확인"
 * /user/myinfo:
 *  get:
 *   tags:
 *   - "user"
 *   summary: "user 정보 보내기"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**"
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   responses:
 *    200:
 *     description: "Success"
 *     schema:
 *      type: "object"
 *      properties:
 *       id:
 *        type: "number"
 *       profileImage:
 *        type: "string"
 *       email:
 *        type: "string"
 *       phone:
 *        type: "string"
 *       nickname:
 *        type: "string"
 *       introduction:
 *        type: "string"
 *    400:
 *     description: "Bad Request. JWT 가 유요하지 않음"
 *    500:
 *     description: "Internal Server Error"
 * /user/profile-content:
 *  get:
 *   tags:
 *   - "user"
 *   summary: "user의 개인 페이지에서 보여질 profile content info"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n"
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "query"
 *     name: "id"
 *     description: "가져오고자 하는 유저의 id"
 *     required: true
 *   responses:
 *    200:
 *     description: "Success"
 *     schema:
 *      $ref: "#definitions/profileContent"
 *    400:
 *     description: "Bad Request\n id 를 가진 user가 없음"
 *    500:
 *     description: "Internal Server Error"
 * /user/follow/{userid}:
 *  post:
 *   tags:
 *   - "user"
 *   summary: "follow 요청"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n"
 *   prodeces:
 *    - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   - in: "path"
 *     name: "user id"
 *     description: "follow 할 user id"
 *     required: true
 *   responses:
 *     200:
 *      description: "Success"
 *     400:
 *      description: "Bad Request\n user id 가 없거나 잘못되었음"
 *     401:
 *      description: "유효하지 않은 토큰"
 *     500:
 *      description: "Internal Server Error"
 *  delete:
 *   tags:
 *   - "user"
 *   summary: "follow 취소"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**"
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   - in: "query"
 *     name: "user id"
 *     description: "follow 취소 할 user id"
 *     required: true
 *   responses:
 *    200:
 *     description: "Success"
 *    400:
 *     description: "Bad Request\n user id 가 없거나 잘못되었음"
 *    401:
 *     description: "유효하지 않은 토큰"
 *    500:
 *     description: "Internal Server Error"
 * /user/checkNicknameDuplication:
 *  post:
 *   tags:
 *   - "user"
 *   summary: "닉네임 중복검사"
 *   description: "닉네임 중복검사한다."
 *   prodeces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "nickname"
 *     description: "검사 하려는 nickname"
 *     required: true
 *   responses:
 *    200:
 *     description: "사용 가능한 닉네임"
 *    400:
 *     description: "요청에 nickname 이 없음\n닉네임에 공백이 있음"
 *    409:
 *     description: "중복된 닉네임"        
 *    500:
 *     description: "서버 에러"    
 */

/**
 * @swagger
 * definitions:
 *  userInfo:
 *   type: "object"
 *   properties:
 *    nickname:
 *     type: "string"
 *    email:
 *     type: "string"
 *    phone:
 *     type: "string"
 *    profileImage:
 *     type: "string"
 *    introduction:
 *     type: "string"
 *  profileContent:
 *   type: "object"
 *   properties:
 *    isFollowing:
 *     type: "boolean"
 *    isMyProfile:
 *     type: "boolean"
 *    nickname:
 *     type: "string"
 *    totalPosts:
 *     type: "number"
 *    totalFollowers:
 *     type: "number"
 *    totalFollowings:
 *     type: "number"
 *    introduction:
 *     type: "string"
 *    profileImage:
 *     type: "string"
 */
const express = require('express');
const router = express.Router();

module.exports = (models, middlewares) => {
  const { isLoggedIn } = middlewares;
  const {
    updateUserProfile,
    getMyInfo,
    getProfileContent,
    addFollow,
    removeFollow,
    checkNicknameDuplication,
  } = require('./user-ctrl')(models);
  
  router.put('/profile', isLoggedIn, updateUserProfile);
  router.get('/myinfo', isLoggedIn, getMyInfo);
  router.get('/profile-content', getProfileContent);
  router.post('/follow/:id', addFollow);
  router.delete('/follow/:id', removeFollow);
  router.post('/checkNicknameDuplication', checkNicknameDuplication);

  return router;
}