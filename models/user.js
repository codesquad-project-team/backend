module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    authority: {
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