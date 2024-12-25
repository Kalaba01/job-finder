const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FirmRequest = sequelize.define('FirmRequest', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
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
    employees_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
});

module.exports = FirmRequest;
