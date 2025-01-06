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
    current_phase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HiringPhase,
        key: "id"
      },
      onDelete: "SET NULL"
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = HiringProcess;
