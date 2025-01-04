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
    }
  },
  job_ad_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: JobAd, 
        key: "id" 
    }
  },
  hiring_process_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: HiringProcess, 
        key: "id" 
    }
  },
  firm_id: {
    type: DataTypes.INTEGER,
    references: { 
        model: Firm, 
        key: "user_id" 
    }
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
