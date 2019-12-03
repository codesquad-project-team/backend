const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Location = require('./location')(sequelize, Sequelize);
db.follow = require('./follow')(sequelize, Sequelize);

db.Post.hasMany(db.Image, {as: "images", foreignKey : 'post_id' , sourceKey : 'id'});
db.Image.belongsTo(db.Post, {as: "post", foreignKey : 'post_id' , targetKey : 'id'});

db.Location.hasMany(db.Post, {as: "posts", foreignKey : 'location_id' , sourceKey : 'id'});
db.Post.belongsTo(db.Location, {as: "location", foreignKey : 'location_id' , targetKey : 'id'});

db.User.hasMany(db.Post, {foreignKey : {name: 'writer_id', allowNull: false}, sourceKey : 'id'});
db.Post.belongsTo(db.User, {foreignKey : 'writer_id' , targetKey : 'id'});

db.User.belongsToMany(db.User, {as : 'followers', foreignKey : 'following_id', through : 'follow'});
db.User.belongsToMany(db.User, {as : 'followings', foreignKey : 'follower_id', through : 'follow'});

module.exports = db;