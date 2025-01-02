const { PDFDocument } = require('pdf-lib');
const { File } = require("../models");

exports.getFileById = async (fileId) => {
  try {
    const file = await File.findOne({ where: { id: fileId } });

    if (!file) return null;

    return {
      content: file.file,
      fileName: file.file_name,
      mimeType: file.file_mime
    };
  } catch (error) {
    console.error("Error fetching file by ID:", error);
    throw new Error("Failed to fetch file.");
  }
};

exports.saveFile = async (file) => {
  if (!file) throw new Error("File is required.");
  return await File.create({
    file: file.buffer,
    file_name: file.originalname,
    file_mime: file.mimetype
  });
};

exports.createPDF = async (application) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  let currentY = height - 50;

  // Candidate Information
  page.drawText('Candidate Information', { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Name: ${application.candidateName}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`About: ${application.candidateAbout || 'N/A'}`, { x: 50, y: currentY, size: fontSize });

  // Job Information
  currentY -= 40;
  page.drawText('Job Information', { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Position: ${application.jobTitle}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Description: ${application.jobDescription || 'N/A'}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Location: ${application.jobLocation || 'Remote'}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Category: ${application.jobCategory || 'General'}`, { x: 50, y: currentY, size: fontSize });

  // Application Details
  currentY -= 40;
  page.drawText('Application Details', { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Submitted On: ${application.date}`, { x: 50, y: currentY, size: fontSize });

  // Custom Answers
  if (application.customQuestions && application.customQuestions.length > 0) {
    currentY -= 40;
    page.drawText('Custom Answers', { x: 50, y: currentY, size: 18 });
    currentY -= 30;
  
    application.customQuestions.forEach((question) => {
      const answer = application.answers[question.id] || 'No Answer Provided';
      page.drawText(`${question.question}: ${answer}`, { x: 50, y: currentY, size: fontSize });
      currentY -= 20;
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
