const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const Image = require("./Image");

const Firm = sequelize.define('Firm', {
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' },
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [3, 100] }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employees: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active_ads: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    archived_ads: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    profile_picture_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Image, key: 'id' }
    },
});

Firm.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Firm.belongsTo(Image, { foreignKey: 'profile_picture_id' });

module.exports = Firm;
