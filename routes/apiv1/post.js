const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Paginator = require('../../src/paginatior');

module.exports = (models, controller, middlewares) => {
  const { User, Post, Location, Image, Sequelize } = models;
  const { parseRelatedData, parsePaginatedData } = controller;
  const { isLoggedIn } = middlewares;
  router.get('/related-to', async (req, res, next) => {
    try{
      const [ postId, page ] = [ req.query.postid, req.query.page ];

      if (!(postId && page)) return next(createError(400));
      
      const perPage = 20;
      const paginator = new Paginator({ model: Post, perPage });
      const attributes = ['id','title_companion','title_activity'];
      const include = [{
                        model : User,
                        attributes : ['profile_image'] 
                      }];
      const where = { 
                      location_id : Sequelize.literal(`location_id = (SELECT location_id FROM posts WHERE id = ${postId})`),
                      id : { [Sequelize.Op.ne] : postId }
                    };
      const paginatedData = await paginator.paginate({ page, attributes, include, where });
      
      if(paginatedData.rows.length === 0) return res.status(204).send();

      const sendingData = parseRelatedData(paginatedData);
      res.json(sendingData);
    } catch (error) {
      return next(error);
    }
  });
  
  router.get('/', async (req, res, next) => {
    try {
      const page = req.query.page;
      const perPage = 20;
  
      if(!page || page === 0) next(createError(400, 'page number must be defined minimum 1'));
  
      const paginator = new Paginator({ model: Post, perPage });
      const where = {};
      if(req.query.writerid) {
        where.writer_id = req.query.writerid;
      }
      const postAttributes = ['id', 'description', 'title_companion', 'title_activity'];
      const include = [{
                        model: User,
                        attributes: ['id', 'profile_image', 'nickname']
                      }, {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                      }, {
                        model: Image,
                        as: 'images',
                        where: { is_representative: true },
                        attributes: ['url']
                      }];
      const order = ['id'];
  
      const paginatedData = await paginator.paginate({ page, attributes: postAttributes, include, order, where });
  
      if(paginatedData.rows.length === 0) return res.status(204).send();
      
      const sendingData = parsePaginatedData(paginatedData);
  
      return res.json(sendingData);
    } catch(error) {
      return next(error);    
    }
  });

  router.post('/', isLoggedIn, async (req, res, next) => {
    const { location, post } = req.body;
    try {
      const locationResult = await Location.findOrCreate({
        where: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        }
      });
      post.writer_id = req.decoded.id;
      post.location_id = locationResult[0].id;
  
      const postResult = await Post.create(post, {
        include: [{
          model: Image, as: 'images'
        }]
      });
      res.json(postResult);
    } catch (error) {
      return next(error)
    }
  });

  router.delete('/:id', isLoggedIn, async (req, res, next) => {
    const userId = req.decoded.id;
    const postId = req.params.id;
    if (!userId) return next(createError(401));
    if (!postId) return next(createError(400));
    try {
      const result = await Post.destroy({
        where: {
          id: postId,
          writer_id: userId
        },
        individualHooks: true
      });
      if (result) return next(createError(400));
      res.send();
    } catch (error) {
      return next(error)
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
                                          as: 'location',
                                          attributes: { exclude: ['id'] }
                                        }, {
                                          model: Image,
                                          as: 'images',
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
        "locationLinkAddress": post.location.link,
      }
      post.images.forEach(image => postInfo.postImageURLs.push(image.url));
      res.json(postInfo);
    } catch(error) {
      return next(error);
    }
  });

  return router;
}