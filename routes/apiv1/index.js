const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../swagger/apiv1/swagger-definition');
const userRouter = require('./user');
const postRouter = require('./post');
const authRouter = require('./auth');
const validateRouter = require('./validate');
const externalAPIRouter = require('./externalAPI');

module.exports = (models, controllers, middlewares) => {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  router.use('/user', userRouter(models, middlewares));
  router.use('/post', postRouter(models, controllers.post));
  router.use('/auth', authRouter(models, controllers.auth, middlewares));
  router.use('/validate', validateRouter(models, null));
  router.use('/externalAPI', externalAPIRouter());
  return router
}