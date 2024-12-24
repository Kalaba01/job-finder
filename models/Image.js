const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Image = sequelize.define('Image', {
  data: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Image;
