const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

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
    attachment: { 
        type: DataTypes.BLOB("long"),
        allowNull: true 
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Ticket;
