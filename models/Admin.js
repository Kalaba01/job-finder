const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Admin = sequelize.define('Admin', {
    user_id: {
        type: DataTypes.INTEGER,
        references: { 
            model: User, 
            key: 'id' 
        },
        onDelete: "CASCADE",
        primaryKey: true
    }
});

module.exports = Admin;
