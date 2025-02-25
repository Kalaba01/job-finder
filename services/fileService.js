const { PDFDocument } = require('pdf-lib');
const { File } = require("../models");

// Retrieves file by its ID
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

// Saves a file
exports.saveFile = async (file) => {
  if (!file) throw new Error("File is required.");
  return await File.create({
    file: file.buffer,
    file_name: file.originalname,
    file_mime: file.mimetype
  });
};

// Creates a PDF for a firm with details of a candidate's application
exports.createForFirmPDF = async (application) => {
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

// Creates a PDF for a candidate with details of the hiring process
exports.createForCandidatePDF = async (application) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  let currentY = height - 50;

  // Firm Information
  page.drawText("Firm Information", { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Name: ${application.firmName}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`City: ${application.firmCity || "N/A"}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Address: ${application.firmAddress || "N/A"}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`About: ${application.firmAbout || "N/A"}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Employees: ${application.firmEmployees || "N/A"}`, { x: 50, y: currentY, size: fontSize });

  // Job Information
  currentY -= 40;
  page.drawText("Job Information", { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Position: ${application.jobTitle}`, { x: 50, y: currentY, size: fontSize });
  currentY -= 20;
  page.drawText(`Status: ${application.jobStatus}`, { x: 50, y: currentY, size: fontSize });

  // Application Details
  currentY -= 40;
  page.drawText("Application Details", { x: 50, y: currentY, size: 18 });
  currentY -= 30;
  page.drawText(`Submitted On: ${application.date}`, { x: 50, y: currentY, size: fontSize });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

// Creates a PDF summarizing the hiring process
exports.createHiringProcessPDF = async (processData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let yPosition = height - 50;
  const fontSize = 12;

  // Title
  page.drawText(`Hiring Process Report`, { x: 50, y: yPosition, size: 20 });
  yPosition -= 30;

  // Job Information
  page.drawText(`Job Title: ${processData.jobTitle}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`Job Description: ${processData.jobDescription}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`Location: ${processData.jobLocation}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`Start Date: ${new Date(processData.processStartDate).toLocaleString()}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`End Date: ${new Date(processData.processEndDate).toLocaleString()}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 40;

  // Candidates
  page.drawText(`Candidates:`, { x: 50, y: yPosition, size: 14 });
  yPosition -= 20;
  processData.candidates.forEach((candidate, index) => {
    page.drawText(`${index + 1}. ${candidate.name} - ${candidate.status}`, { x: 50, y: yPosition, size: fontSize });
    yPosition -= 20;
    page.drawText(`  About: ${candidate.about}`, { x: 70, y: yPosition, size: fontSize });
    yPosition -= 20;

    candidate.history.forEach((historyItem) => {
      page.drawText(
        `  - ${historyItem.phaseName}: ${historyItem.comment || "No comments"} (${new Date(historyItem.date).toLocaleString()})`,
        { x: 70, y: yPosition, size: fontSize }
      );
      yPosition -= 15;
    });

    yPosition -= 10;
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
