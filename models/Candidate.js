const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require("./User");
const Image = require("./Image");

const Candidate = sequelize.define('Candidate', {
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' },
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 50] }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 50] }
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cv: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    motivation_letter: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    recommendations: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    profile_picture_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Image, key: 'id' }
    },
});

Candidate.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Candidate.belongsTo(Image, { foreignKey: 'profile_picture_id' });

module.exports = Candidate;
