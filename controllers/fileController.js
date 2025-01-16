const fileService = require("../services/fileService");

// Fetches a file by its ID
exports.getFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const fileData = await fileService.getFileById(fileId);

    if (!fileData) return res.status(404).send("File not found");

    res.setHeader("Content-Type", fileData.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileData.fileName}"`);
    res.send(fileData.content);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Failed to fetch file.");
  }
};
