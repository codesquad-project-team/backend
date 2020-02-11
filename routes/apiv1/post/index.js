/**
 * @swagger
 * tags:
 * - name: "post"
 *   description: "포스트에 관한 것들"
 */

/**
 * @swagger
 * /post:
 *  post:
 *   tags:
 *   - "post"
 *   summary: "post 등록"
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
 *     name: "post-info"
 *     description: "등록할 포스트 정보"
 *     require: true
 *     schema:
 *      $ref: "#/definitions/uploadingPost"
 *   responses:
 *    200:
 *     description: "Success"
 *     schema:
 *      type: "object"
 *      properties:
 *       id:
 *        type: "number"
 *    400:
 *      description: "post나 location 정보가 없다"
 *    401:
 *     description: "unauthorized, 로그인 안한 회원"
 *    500:
 *     description: "Internal Server Error"
 *  get:
 *   tags:
 *   - "post"
 *   summary: "각 페이지당 20개의 포스트를 전달한다.\n 포스트 작성 시간의 역순으로 전달한다."
 *   prodeces:
 *    - "application/json"
 *   parameters:
 *   - in: "query"
 *     name: "page"
 *     description: "page number minimum 1"
 *     required: true
 *   - in: "query"
 *     name: "writerid"
 *     description: "특정 유저가 작성한 Post 만 가져오고 싶을 때 writer id 를 입력"
 *     required: false
 *   responses:
 *    200:
 *     description: "Success"
 *     schema:
 *      type: "object"
 *      properties:
 *       hasNextPage:
 *        type: "boolean"
 *       posts:
 *        type: "array"
 *        items:
 *         $ref: "#definitions/postThumbnailInfo"
 *    204:
 *     description: "No Contents.\n해당 page의 post가 없다."
 *    400:
 *     description: "Bad Request.\n잘못된 page number"
 *    500:
 *     description: "Internal Server Error"
 * /post/{postid}:
 *  get:
 *   tags:
 *   - "post"
 *   summary: "get full post info by post id"
 *   description: "Return full post info"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "path"
 *     name: "postid"
 *     description: "post id"
 *     required: true
 *   responses:
 *    200:
 *     description: "Success"
 *     schema:
 *      $ref: "#/definitions/fullPostInfo"
 *    400:
 *     description: "Bad Request.\npost id가 없다."
 *    404:
 *     description: "Not found.\n해당 post id의 post가 없다."
 *  put:
 *   tags:
 *   - "post"
 *   summary: "update post"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**\n**업데이트할 정보만 담아서 요청할것**"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   - in: "body"
 *     name: "post-info"
 *     description: "업데이트할 포스트 정보"
 *     require: true
 *     schema:
 *      $ref: "#/definitions/uploadingPost"
 *   responses:
 *    200:
 *     description: "Success"
 *    400:
 *     description: "post id가 없거나 data 가 없다."
 *    401:
 *     description: "unauthorized"
 *    500:
 *     description: "internal server error"
 *  delete:
 *   tags:
 *   - "post"
 *   summary: "delete post"
 *   description: "**fetch 에 {credentials: 'include'} 옵션 필요**"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "cookie"
 *     name: "token"
 *     description: "json web token"
 *     required: true
 *     schema:
 *      type: "string"
 *   - in: "query"
 *     name: "id"
 *     description: "post id"
 *     required: true
 *   responses:
 *    200:
 *     description: "Success"
 *    400:
 *     description: "Bad Request.\npost id가 없다."
 *    401:
 *     description: "unauthorized"
 *    500:
 *     description: "internal server error"
 * /post/related-to:
 *  get:
 *   tags:
 *   - "post"
 *   summary: "get post list related to post id"
 *   description: "해당 post id 와 같은 장소인 길이가 최대 20인 Post List 를 리턴한다."
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "query"
 *     name: "postid"
 *     description: "post id"
 *     required: true
 *   - in: "query"
 *     name: "page"
 *     description: "page number"
 *     required: true
 *   responses:
 *    200:
 *     description: "Ok"
 *     schema:
 *      type: "object"
 *      properties:
 *       hasNextPage:
 *        type: "boolean"
 *       posts:
 *        type: "array"
 *        items:
 *         $ref: "#/definitions/relatedPost"
 *    204:
 *     description: "No Contents.\n해당 장소에 다른 게시글이 없을 때\npage number 가 커서 더이상 글이 없을 때\n존재 하지 않는 post id 일 때"
 *    400:
 *     description: "Bad Request.\n요청에 post id or page number 가 없을 때" 
 */

/**
 * @swagger
 * definitions:
 *  uploadingPost:
 *   type: "object"
 *   properties:
 *    location:
 *     type: "object"
 *     properties:
 *      name:
 *       type: "string"
 *      latitude:
 *       type: "number"
 *      longitude:
 *       type: "number"
 *      address:
 *       type: "string"
 *      link:
 *       type: "string"
 *      phone:
 *       type: "string"
 *    post:
 *     type: "object"
 *     properties:
 *      place:
 *       type: "string"
 *      companion:
 *       type: "string"
 *      activity:
 *       type: "string"
 *      description:
 *       type: "string"
 *      images:
 *       type: "array"
 *       items:
 *        type: "object"
 *        properties:
 *         url:
 *          type: "string"
 *         isRepresentative:
 *          type: "boolean"
 *  fullPostInfo:
 *   type: "object"
 *   properties:
 *    post:
 *     type: "object"
 *     properties:
 *      id:
 *       type: "number"
 *      place:
 *       type: "string"
 *      companion:
 *       type: "string"
 *      activity:
 *       type: "string"
 *      description:
 *       type: "string"
 *      images:
 *       type: "array"
 *       items:
 *        type: "object"
 *        properties:
 *         isRepresentative:
 *          type: "boolean"
 *         url:
 *          type: "string"
 *    location:
 *     type: "object"
 *     properties:
 *      name:
 *       type: "string"
 *      latitude:
 *       type: "number"
 *       format: "float"
 *      longitude:
 *       type: "number"
 *       format: "float"
 *      address:
 *       type: "string"
 *      link:
 *       type: "string"
 *      phone:
 *       type: "string"
 *    writer:
 *     type: "object"
 *     properties:
 *      id:
 *       type: "number"
 *      nickname:
 *       type: "string"
 *      profileImage:
 *       type: "string"
 *  relatedPost:
 *   type: "object"
 *   properties:
 *    id:
 *     type : "number"
 *    companion:
 *     type: "string"
 *    activity:
 *     type: "string"
 *    writer:
 *     type: "object"
 *     properties:
 *      profileImage:
 *       type: "string"
 *  postThumbnailInfo:
 *   type: "object"
 *   properties:
 *    id:
 *     type: "number"
 *    place:
 *     type: "string"
 *    companion:
 *     type: "string"
 *    activity:
 *     type: "string"
 *    description:
 *     type: "string"
 *    writer:
 *     type: "object"
 *     properties:      
 *      id:
 *       type: "number"
 *      profileImage:
 *       type: "string"
 *      nickname:
 *       type: "string"
 *    image:
 *      type: "string"
 *  tokenInfo:
 *   type: "object"
 *   properties:
 *    id:
 *     type: "number"
 *    nickname:
 *     type: "string"
 *    profileImage:
 *     type: "string"
 */ 

const express = require('express');
const router = express.Router();

module.exports = (models, middlewares) => {
  const {
    getMainPagePosts,
    getPost,
    getRelatedPosts,
    createPost,
    updatePost,
    removePost,
 } =  require('./post-ctrl')(models);
  const { isLoggedIn } = middlewares;
  
  router.get('/related-to', getRelatedPosts);
  router.get('/', getMainPagePosts);
  router.get('/:id', getPost);
  router.post('/', isLoggedIn, createPost);
  router.put('/:id', isLoggedIn, updatePost);
  router.delete('/:id', isLoggedIn, removePost);

  return router;
};