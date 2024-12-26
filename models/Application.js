const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const JobAd = require("./JobAd");
const Candidate = require("./Candidate");

const Application = sequelize.define(
  "Application",
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
    submitted_documents: {
      type: DataTypes.JSON,
      allowNull: true
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("pending", "rejected", "accepted"),
      defaultValue: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = Application;
