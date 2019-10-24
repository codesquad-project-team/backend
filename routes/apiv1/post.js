const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Paginator = require('../../src/paginatior');

module.exports = (models, controller) => {
  const { User, Post, Location, Image, Sequelize } = models;
  const { parseRelatedData, parsePaginatedData } = controller;
  router.get('/related-to', async (req, res, next) => {
    const query = req.query;
  
    // postid || page number 가 없으면 400에러
    if (!query['post-id'] || !query['page']) {
      return next(createError(400));
    }
  
    try{
      //location_id 가 같은 post 가져오기
      // 일단 pagenumber 상관없이 전체 리스트 전송
      const post = await Post.findAll({
        attributes : ['id','title_companion','title_activity'],
        include : [
          {
            model : User,
            attributes : ['profile_image']
          },
        ],
        where : {
          location_id : Sequelize.literal(`location_id = (SELECT location_id FROM posts WHERE id = ${query['post-id']})`),
          id : {
            [Sequelize.Op.ne] : query['post-id']
          }
        }
      })
  
      // 해당 장소에 다른 게시글이 없을 때
      // page number 가 커서 더이상 글이 없을 때
      // status code : 204 , No contents
      if (!post.length) {
        return res.status(204).json([]);
      }
    
      const sendingData = parseRelatedData(post);
    
      res.json(sendingData);
  
    }catch (error) {
      return next(error);
    }
  });
  
  router.get('/', async (req, res, next) => {
    try {
      const page = req.query.page;
      const perPage = 20;
  
      if(!page || page === 0) next(createError(400, 'page number must be defined minimum 1'));
  
      const paginator = new Paginator({ model: Post, perPage });
      const postAttributes = ['id', 'description', 'title_companion', 'title_activity'];
      const include = [{
                        model: User,
                        attributes: ['profile_image', 'nickname']
                      }, {
                        model: Location,
                        attributes: ['name']
                      }, {
                        model: Image,
                        where: { is_representative: true },
                        attributes: ['url']
                      }];
      const order = ['id'];
  
      const paginatedData = await paginator.paginate({ page, attributes: postAttributes, include, order });
  
      if(paginatedData.rows.length === 0) return res.status(204).send();
      
      const sendingData = parsePaginatedData(paginatedData);
  
      return res.json(sendingData);
    } catch(error) {
      return next(error);    
    }
  });
  
  router.get('/:id', async (req, res, next) => {
    try {
      const postId = req.params.id;
  
      if(postId === undefined) return next(createError(400));
  
      const post = await Post.findOne({
                              where: { id: postId }, 
                              attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'location_id', 'user_email']},
                              include: [{
                                          model: User, 
                                          attributes: ['nickname', 'profile_image']
                                        }, {
                                          model: Location,
                                          attributes: { exclude: ['id'] }
                                        }, {
                                          model: Image,
                                          attributes: ['url']
                                        }]
                            });
  
      if(post === null) return next(createError(404));
      
      const postInfo = {
        "titlePlace": post.location.name,
        "titleCompanion": post.title_companion,
        "titleActivity": post.title_activity,
        "description": post.description,
        "postImageURLs": [],
        "writerNickname": post.user.nickname,
        "writerImageURL": post.user.profile_image,
        "locationLatitude": parseFloat(post.location.latitude),
        "locationLongitude": parseFloat(post.location.longitude),
        "locationAddress": post.location.address,
        "locationPhoneNumber": post.location.phone,
        "locationLinkAddress": post.link
      }
      post.images.forEach(image => postInfo.postImageURLs.push(image.url));
      res.json(postInfo);
    } catch(error) {
      return next(error);
    }
  });

  return router;
}