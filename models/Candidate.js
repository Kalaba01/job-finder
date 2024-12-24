const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Image = require("./Image");
const File = require("./File");

const Candidate = sequelize.define("Candidate", {
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: "id" },
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
  cv_file_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: File, key: "id" }
  },
  motivation_file_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: File, key: "id" }
  },
  recommendations_file_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: File, key: "id" }
  },
  profile_picture_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Image, key: "id" }
  }
});

module.exports = Candidate;
