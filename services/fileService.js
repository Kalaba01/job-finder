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
