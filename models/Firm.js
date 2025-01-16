const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const Image = require("./Image");

const Firm = sequelize.define('Firm', {
    user_id: {
        type: DataTypes.INTEGER,
        references: { 
            model: User, 
            key: 'id' 
        },
        onDelete: "CASCADE",
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [3, 100] }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 50] }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 50] }
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { len: [2, 500] }
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
        references: { 
            model: Image, 
            key: 'id' 
        }
    }
});

module.exports = Firm;
