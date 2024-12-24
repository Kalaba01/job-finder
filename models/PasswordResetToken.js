const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = PasswordResetToken;
