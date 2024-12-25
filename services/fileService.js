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
