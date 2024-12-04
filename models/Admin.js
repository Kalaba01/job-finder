const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Admin = sequelize.define('Admin', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
});

Admin.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Admin;
