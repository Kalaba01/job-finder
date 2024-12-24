const candidateService = require("./candidateService");
const { File } = require("../models");

exports.getCandidateFile = async (candidateId, type) => {
  try {
    const candidate = await candidateService.findCandidateByUserId(candidateId);

    if (!candidate) throw new Error("Candidate not found");

    let fileContent;
    let fileName;
    let mimeType = "application/octet-stream";

    switch (type) {
      case "cv":
        fileContent = candidate.cv;
        fileName = `cv_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      case "motivation_letter":
        fileContent = candidate.motivation_letter;
        fileName = `motivation_letter_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      case "recommendations":
        fileContent = candidate.recommendations;
        fileName = `recommendations_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      default:
        throw new Error("Invalid file type");
    }

    if (!fileContent) throw new Error("File not found");

    return {
      content: fileContent,
      fileName,
      mimeType
    };
  } catch (error) {
    console.error("Error fetching candidate file:", error);
    throw error;
  }
};

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
