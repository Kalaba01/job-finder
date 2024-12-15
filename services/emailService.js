const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const juice = require("juice");
const transporter = require("../config/transporterConfig");

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
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

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

exports.sendFirmApprovedEmail = async (email, firm_name, token) => {
  try {
    const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;
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
