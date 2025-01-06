const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const HiringProcess = require("./HiringProcess");
const Candidate = require("./Candidate");
const HiringPhase = require("./HiringPhase");

const HiringProcessCandidate = sequelize.define(
  "HiringProcessCandidate",
  {
    hiring_process_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HiringProcess,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Candidate,
        key: "user_id"
      },
      onDelete: "CASCADE"
    },
    phase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HiringPhase,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    status: {
      type: DataTypes.ENUM("pending", "passed", "failed"),
      defaultValue: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = HiringProcessCandidate;
