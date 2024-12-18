const candidateService = require("./candidateService");

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
        fileName = "cv.pdf";
        mimeType = "application/pdf";
        break;

      case "motivation_letter":
        fileContent = candidate.motivation_letter;
        fileName = "motivation_letter.pdf";
        mimeType = "application/pdf";
        break;

      case "recommendations":
        fileContent = candidate.recommendations;
        fileName = "recommendations.pdf";
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
