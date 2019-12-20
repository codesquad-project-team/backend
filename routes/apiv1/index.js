const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../swagger/apiv1/swagger-definition');
const userRouter = require('./user');
const postRouter = require('./post');
const authRouter = require('./auth');

module.exports = (models, middlewares) => {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  router.use('/user', userRouter(models, middlewares));
  router.use('/post', postRouter(models, middlewares));
  router.use('/auth', authRouter(models, middlewares));
  
  return router
}