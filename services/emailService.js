const transporter = require("../config/transporterConfig");
const ejs = require("ejs");
const fs = require("fs");
const juice = require("juice");

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
