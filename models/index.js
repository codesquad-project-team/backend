const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Location = require('./location')(sequelize, Sequelize);

db.Post.hasMany(db.Image, {foreignKey : 'post_id' , sourceKey : 'id'});
db.Image.belongsTo(db.Post, {foreignKey : 'post_id' , targetKey : 'id'});

db.Location.hasMany(db.Post, {foreignKey : 'location_id' , sourceKey : 'id'});
db.Post.belongsTo(db.Location, {foreignKey : 'location_id' , targetKey : 'id'});

db.User.hasMany(db.Post, {foreignKey : 'user_email' , sourceKey : 'email'});
db.Post.belongsTo(db.User, {foreignKey : 'user_email' , targetKey : 'email'});

db.User.belongsToMany(db.User, {as : 'followers', foreignKey : 'follower_email', through : 'follow'});
db.User.belongsToMany(db.User, {as : 'followings', foreignKey : 'follwing_email', through : 'follow'});

module.exports = db;
