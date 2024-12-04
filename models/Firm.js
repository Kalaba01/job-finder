const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Firm = sequelize.define('Firm', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employees: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active_ads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  archived_ads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Firm.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Firm;
