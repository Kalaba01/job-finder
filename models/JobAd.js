const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Firm = require("./Firm");

const JobAd = sequelize.define("JobAd", {
  firm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Firm,
      key: "user_id"
    },
    onDelete: "CASCADE"
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [5, 255] }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  required_documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  custom_questions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("open", "closed"),
    defaultValue: "open"
  }
}, {
  timestamps: true
});

module.exports = JobAd;
