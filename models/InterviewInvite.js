const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Candidate = require("./Candidate");
const Firm = require("./Firm");
const JobAd = require("./JobAd");
const HiringProcess = require("./HiringProcess");

const InterviewInvite = sequelize.define("InterviewInvite", {
  candidate_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: Candidate, 
        key: "user_id" 
    },
    onDelete: "CASCADE"
  },
  job_ad_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: JobAd, 
        key: "id" 
    },
    onDelete: "CASCADE"
  },
  hiring_process_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: HiringProcess, 
        key: "id" 
    },
    onDelete: "CASCADE"
  },
  firm_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: Firm, 
        key: "user_id" 
    },
    onDelete: "CASCADE"
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending"
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = InterviewInvite;
