const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../swagger/apiv1/swagger-definition');
const userRouter = require('./user');
const postRouter = require('./post');
const authRouter = require('./auth');

module.exports = (models, controllers) => {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  router.use('/user', userRouter(models));
  router.use('/post', postRouter(models, controllers.post));
  router.use('/auth', authRouter(models, controllers.auth));
  return router
}