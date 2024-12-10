const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require("./User");
const Image = require("./Image");

const Candidate = sequelize.define('Candidate', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cv: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  motivation_letter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recommendations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile_picture_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Image,
      key: 'id',
    },
  }
});

Candidate.belongsTo(User, { foreignKey: 'user_id' });
Candidate.belongsTo(Image, { foreignKey: 'profile_picture_id' });

module.exports = Candidate;
