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

exports.convertImageToBase64 = (image) => {
  try {
    if (!image) return null;

    const base64String = `data:${image.mime_type};base64,${image.data.toString("base64")}`;
    return base64String;
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    throw new Error("Failed to convert image to Base64.");
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
