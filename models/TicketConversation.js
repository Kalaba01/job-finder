const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");

const TicketConversation = sequelize.define(
  "TicketConversation",
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tickets",
        key: "id"
      },
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
    },
    sender_role: {
      type: DataTypes.ENUM("admin", "firm", "candidate"),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    timestamps: true
  }
);

module.exports = TicketConversation;