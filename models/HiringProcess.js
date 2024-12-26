const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const JobAd = require("./JobAd");
const Candidate = require("./Candidate");
const HiringPhase = require("./HiringPhase");

const HiringProcess = sequelize.define(
  "HiringProcess",
  {
    job_ad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: JobAd,
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
    current_phase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HiringPhase,
        key: "id"
      },
      onDelete: "SET NULL"
    },
    phase_status: {
      type: DataTypes.ENUM("pending", "passed", "failed"),
      defaultValue: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = HiringProcess;
