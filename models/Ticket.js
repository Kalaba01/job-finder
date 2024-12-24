const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const File = require("./File");

const Ticket = sequelize.define(
  "Ticket",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_role: {
      type: DataTypes.ENUM("firm", "candidate"),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      references: { model: File, key: "id" },
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Ticket;
