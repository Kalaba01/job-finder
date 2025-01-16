const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Image = require("./Image");
const File = require("./File");

const Candidate = sequelize.define("Candidate", {
  user_id: {
    type: DataTypes.INTEGER,
    references: { 
      model: User, 
      key: "id" 
    },
    onDelete: "CASCADE",
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
    references: { 
      model: File, 
      key: "id" 
    },
    onDelete: "SET NULL"
  },
  motivation_file_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { 
      model: File, 
      key: "id" 
    },
    onDelete: "SET NULL"
  },
  recommendations_file_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { 
      model: File, 
      key: "id" 
    },
    onDelete: "SET NULL"
  },
  profile_picture_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { 
      model: Image, 
      key: "id" 
    },
    onDelete: "SET NULL"
  }
});

module.exports = Candidate;
