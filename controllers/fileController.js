const fileService = require("../services/fileService");

exports.getCandidateFile = async (req, res) => {
  try {
    const { candidateId, type } = req.params;
    const fileData = await fileService.getCandidateFile(candidateId, type);

    if (!fileData) return res.status(404).send("File not found");

    res.setHeader("Content-Type", fileData.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename=${fileData.fileName}`);
    res.send(fileData.content);
  } catch (error) {
    console.error("Error fetching candidate file:", error);
    res.status(500).send("Failed to fetch file.");
  }
};
