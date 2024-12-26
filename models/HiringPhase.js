const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const HiringPhase = sequelize.define(
  "HiringPhase",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

module.exports = HiringPhase;
