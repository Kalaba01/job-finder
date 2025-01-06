const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const HiringProcess = require("./HiringProcess");
const HiringPhase = require("./HiringPhase");

const InterviewComment = sequelize.define(
  "InterviewComment",
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
    phase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HiringPhase,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = InterviewComment;
