const createError = require('http-errors');

module.exports = (models) => {
  const controller = {};
  const Paginator = require('../../../src/lib/paginatior');
  const { User, Post, Location, Image, Sequelize } = models;
  
  controller.getRelatedPosts = async (req, res, next) => {
    try{
      const { page, postid: postId } = req.query;
      if (!postId || !page) return next(createError(400));
      const paginator = new Paginator({ model: Post, perPage: 20 });
      const attributes = ['id','companion','activity'];
      const include = [{
        model: User,
        attributes: ['profileImage'],
      }];
      const where = {
        locationId:
          Sequelize.literal(
            `locationId = (SELECT locationId FROM posts WHERE id = ${postId})`
          ),
        id: { [Sequelize.Op.ne]: postId }
      };
      const paginatedData = await paginator.paginate({ page, attributes, include, where });
      if(paginatedData.rows.length === 0) return res.status(204).send();
      const sendingData = parseRelatedData(paginatedData);
  
      res.json(sendingData);
    } catch (error) {
      return next(error);
    }
  };
  
  controller.getMainPagePosts = async (req, res, next) => {
    try {
      const page = req.query.page;
      const perPage = 20;
      if(!page || page === 0) next(createError(400, 'page number must be defined minimum 1'));
      const paginator = new Paginator({ model: Post, perPage });
      const where = {};
  
      if(req.query.writerid) {
        where.writerId = req.query.writerid;
      }
  
      const postAttributes = [
        'id',
        'createdAt',
        'description',
        'companion',
        'activity',
        'place'
      ];
      const include = [
        {
          model: User,
          attributes: ['id', 'profileImage', 'nickname']
        }, {
          model: Location,
          as: 'location',
          attributes: ['name']
        }, {
          model: Image,
          as: 'images',
          where: { isRepresentative: true },
          attributes: ['url']
        }
      ];
      const order = [['createdAt', 'DESC']];
      const paginatedData = await paginator.paginate({
        page,
        attributes: postAttributes,
        include,
        order,
        where
      });
      if(paginatedData.rows.length === 0) return res.status(204).send();
      const sendingData = parsePaginatedData(paginatedData);
  
      return res.json(sendingData);
    } catch(error) {
      return next(error);    
    }
  };
  
  controller.createPost = async (req, res, next) => {
    const { location, post } = req.body;
    if ( !location || !post ) return next(createError(400, 'post, location are required'));
    const { name, latitude, longitude, address, link, phone } = location;
  
    try {
      const locationResult = await Location.findOrCreate({
        where: { name, address },
        defaults: { latitude, longitude, link, phone }
      });
      post.writerId = req.decoded.id;
      post.locationId = locationResult[0].id;
  
      const postResult = await Post.create(post, {
        include: [{ model: Image, as: 'images' }],
      });
  
      res.json({ id: postResult.id });
    } catch (error) {
      return next(error)
    }
  };
  
  controller.updatePost = async (req, res, next) => {
    if (!(req.body.location || req.body.post)) return next(createError(400, 'There is no data'));

    const { location } = req.body;
    const post = req.body.post || {};

    const { id } = req.params;

    if (!id) return next(createError(400, 'postid is required'));

    try {
      if (location) {
        const { name, latitude, longitude, address, link, phone } = location;
        const locationResult = await Location.findOrCreate({
          where: { name, address },
          defaults: { latitude, longitude, link, phone }
        });
        post.locationId = locationResult[0].id;
      }
  
      if (post.images) {
        post.images.map((image) => image.postId = id);
        await Image.destroy({ where: { postId: id } });
        await Image.bulkCreate(post.images);
      }
      
      await Post.update(post, { where: { id } });
  
      return res.send();
    } catch (error) {
      return next(error);
    }
  };
  
  controller.removePost = async (req, res, next) => {
    const userId = req.decoded.id;
    const postId = req.params.id;
    if (!userId) return next(createError(401));
    if (!postId) return next(createError(400));
  
    try {
      const result = await Post.destroy({
        where: {
          id: postId,
          writerId: userId,
        },
        individualHooks: true
      });
      if (!result) return next(createError(404, 'no Post'));
  
      return res.send();
    } catch (error) {
      return next(error);
    }
  };
  
  controller.getPost =  async (req, res, next) => {
    try {
      const postId = req.params.id;
      if(!postId) return next(createError(400));
      const post = await Post.findOne({
        where: { id: postId }, 
        attributes: {
          exclude: [
            'id',
            'createdAt',
            'updatedAt',
            'locationId',
            'writerId',
          ],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'profileImage']
          }, {
            model: Location,
            as: 'location',
            attributes: { exclude: ['id'] }
          }, {
            model: Image,
            as: 'images',
            attributes: ['url', 'isRepresentative']
        }]
      });
      if(post === null) return next(createError(404, 'no Post'));
      const { place, companion, activity, description } = post;
      const { name, latitude, longitude, address, link, phone } = post.location;
      const { id, nickname, profileImage } = post.user;
      const images = post.images.reduce((accumulator, currentValue) => {
        const { url, isRepresentative } = currentValue;
        const image = { url, isRepresentative };
        accumulator.push(image);
        
        return accumulator;
      }, []);
      const postInfo = {
        post: {
          id: postId,
          place,
          companion,
          activity,
          images,
          description,
        },
        location: {
          name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address,
          link,
          phone,
        },
        writer: {
          id,
          nickname,
          profileImage,
        },
      };

      return res.json(postInfo);
    } catch(error) {
      return next(error);
    }
  };

  const parseRelatedData = (paginatedData) => {
    return paginatedData.rows.reduce((accumulator, { id, companion, activity, user }) => {
      accumulator.posts.push({
        id,
        companion,
        activity,
        writer: {
          profileImage: user.profileImage,
        },
      });

      return accumulator;
    }, { hasNextPage: paginatedData.hasNextPage, posts: [] });
  };

  const parsePaginatedData = (paginatedData) => {
    return paginatedData.rows.reduce((accumulator, { id, place, companion, activity, description, user, images }) => {
      accumulator.posts.push({
        id,
        place,
        companion,
        activity,
        description,
        writer: {
          id: user.id,
          nickname: user.nickname,
          profileImage: user.profileImage,
        },
        image: images[0].url,
      });

      return accumulator;
    }, { hasNextPage: paginatedData.hasNextPage, posts: [] });
  };

  return controller;
};