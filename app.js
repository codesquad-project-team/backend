const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelize = require('./models').sequelize;
const app = express();
require('dotenv').config();
app.set('jwtSecret', process.env.JWT_SECRET);
app.set('naverSearchClientId', process.env.NAVER_SEARCH_CLIENT_ID);
app.set('naverSearchClientSecret', process.env.NAVER_SEARCH_CLIENT_SECRET);

const cors = require('cors');
const corsOptions = require('./cors');

const passport = require('passport');
const passportConfig = require('./passport');

const middlewares = {
  v1: require('./middlewares')
}

const models = {
  v1: require('./models')
}

const controllers = {
  v1: require('./controllers')(models.v1)
}

const apiRouters = {
  v1: require('./routes/apiv1')(models.v1, controllers.v1, middlewares.v1)
}

sequelize.sync();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
passportConfig(passport, controllers.v1);

app.use(middlewares.v1.decodeToken);
app.use(middlewares.v1.renewToken);

app.use('/v1', apiRouters.v1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.message);
});

module.exports = app;