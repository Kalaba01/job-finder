const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const juice = require("juice");
const transporter = require("../config/transporterConfig");

// Sends an email with EJS templates and optional inline CSS
exports.sendEmail = async (to, subject, templatePath, templateData, cssPath) => {
  try {
    const rawHtml = await ejs.renderFile(templatePath, templateData);

    let html = rawHtml;
    if (cssPath) {
      const css = fs.readFileSync(cssPath, "utf8");
      html = juice.inlineContent(rawHtml, css);
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Sends a welcome email to a new candidate
exports.sendCandidateWelcomeEmail = async (email, first_name) => {
  try {
    const subject = "Welcome to Job Finder!";
    const templatePath = path.join(__dirname, "../views/emails/welcome.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/welcome.css");
    const templateData = { first_name };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Candidate welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending candidate welcome email to ${email}:`, error.message || error);
    throw new Error("Failed to send candidate welcome email.");
  }
};

// Sends a password reset email with a reset link
exports.sendPasswordResetEmail = async (email, token) => {
  try {
    const resetPasswordLink = `http://localhost:3000/password/reset-password?token=${token}`;
    const subject = "Reset Your Password";
    const templatePath = path.join(__dirname, "../views/emails/password-reset.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/password-reset.css");
    const templateData = {
      resetPasswordLink
    };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error.message || error);
    throw new Error("Failed to send password reset email.");
  }
};

// Sends an email to a firm when their registration is approved
exports.sendFirmApprovedEmail = async (email, firm_name, token) => {
  try {
    const resetPasswordLink = `http://localhost:3000/password/reset-password?token=${token}`;
    const subject = "Welcome to Job Finder!";
    const templatePath = path.join(__dirname, "../views/emails/firm-approved.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/firm-approved.css");
    const templateData = {
      firmName: firm_name,
      resetPasswordLink,
    };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Firm approval email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending firm approval email to ${email}:`, error.message || error);
    throw new Error("Failed to send firm approval email.");
  }
};

// Sends an email to a firm when their registration is rejected
exports.sendFirmRejectEmail = async (email, firm_name) => {
  try {
    const subject = "Firm Registration Rejected";
    const templatePath = path.join(__dirname, "../views/emails/firm-rejected.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/firm-rejected.css");
    const templateData = {
      firmName: firm_name,
    };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Firm rejection email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending firm rejection email to ${email}:`, error.message || error);
    throw new Error("Failed to send firm rejection email.");
  }
};

// Sends an email to a candidate notifying them of their application acceptance
exports.sendCandidateAcceptedEmail = async (email, first_name, job_title) => {
  try {
    const subject = "Your Application Has Been Accepted!";
    const templatePath = path.join(__dirname, "../views/emails/candidate-accepted.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/candidate-accepted.css");
    const templateData = { first_name, job_title };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Candidate accepted email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending candidate accepted email to ${email}:`, error.message || error);
    throw new Error("Failed to send candidate accepted email.");
  }
};

// Sends an email to a candidate notifying them of their application rejection
exports.sendCandidateRejectedEmail = async (email, first_name, job_title) => {
  try {
    const subject = "Your Application Has Been Rejected";
    const templatePath = path.join(__dirname, "../views/emails/candidate-rejected.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/candidate-rejected.css");
    const templateData = { first_name, job_title };

    await this.sendEmail(email, subject, templatePath, templateData, cssPath);
    console.log(`Candidate rejected email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending candidate rejected email to ${email}:`, error.message || error);
    throw new Error("Failed to send candidate rejected email.");
  }
};
