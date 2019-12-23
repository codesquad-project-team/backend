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

db.Post.hasMany(
  db.Image,
  {
    as: "images",
    foreignKey: 'postId',
    sourceKey: 'id',
    onDelete: 'cascade',
    hooks: true,
  },
);

db.Image.belongsTo(
  db.Post,
  {
    as: "post",
    foreignKey: 'postId',
    targetKey: 'id',
  },
);

db.Location.hasMany(
  db.Post,
  {
    as: "posts",
    foreignKey: 'locationId',
    sourceKey: 'id'
  },
);

db.Post.belongsTo(
  db.Location,
  {
    as: "location",
    foreignKey: 'locationId',
    targetKey: 'id'
  },
);

db.User.hasMany(
  db.Post,
  {
    foreignKey : {
      name: 'writerId',
      allowNull: false
    },
    sourceKey: 'id',
  },
);

db.Post.belongsTo(
  db.User,
  {
    foreignKey: 'writerId',
    targetKey: 'id',
  },
);

db.User.belongsToMany(
  db.User,
  {
    as: 'followers',
    foreignKey: 'followingId',
    through: 'follow',
  },
);

db.User.belongsToMany(
  db.User,
  {
    as: 'followings',
    foreignKey: 'followerId',
    through: 'follow',
  },
);

db.Post.addHook('afterDestroy', async post => {
  try {
    const images = await post.getImages();
    return images.map(async image => await image.destroy());
  } catch (error) {
    throw error;
  }
});

module.exports = db;