module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    ahtuority: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'normal'
    }
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'user'
  });
  return user;
};