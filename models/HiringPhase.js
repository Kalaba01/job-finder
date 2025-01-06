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
    },
    is_final: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: false
  }
);

module.exports = HiringPhase;
