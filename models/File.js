const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const File = sequelize.define(
  "File",
  {
    file: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_mime: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = File;
