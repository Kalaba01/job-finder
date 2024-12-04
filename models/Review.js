const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Review = sequelize.define('Review', {
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewed_firm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Review;
