const fs = require("fs");
const path = require("path");
const { Image } = require("../models");

exports.findImageById = async (imageId) => {
  try {
    const image = await Image.findByPk(imageId);
    return image;
  } catch (error) {
    console.error("Error finding image by ID:", error);
    throw new Error("Failed to find image.");
  }
};

exports.setDefaultPicture = async (type, transaction = null) => {
  const validTypes = ["candidate", "firm", "admin"];
  if (!validTypes.includes(type)) throw new Error(`Invalid type provided for default picture: ${type}`);

  const imagePath = path.join(__dirname, `../public/images/default-${type}.jpg`);
  const imageData = fs.readFileSync(imagePath);
  const defaultImage = await Image.create(
    { data: imageData, mime_type: "image/jpeg" },
    { transaction }
  );

  return defaultImage;
};

exports.replaceImage = async (file, imageId) => {
  try {
    if (!file) throw new Error("No file provided for upload");

    const image = await this.findImageById(imageId);
    if (!image) throw new Error("Image not found");

    await image.update({
      data: file.buffer,
      mime_type: file.mimetype
    });

    return image.id;
  } catch (error) {
    console.error("Error replacing image:", error);
    throw new Error("Failed to replace image");
  }
};
