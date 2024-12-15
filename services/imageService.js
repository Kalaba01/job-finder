const fs = require("fs");
const path = require("path");
const { Image } = require("../models");

exports.setDefaultPicture = async (type, transaction = null) => {
  const validTypes = ["candidate", "firm", "admin"];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type provided for default picture: ${type}`);
  }

  const imagePath = path.join(__dirname, `../public/images/default-${type}.jpg`);
  const imageData = fs.readFileSync(imagePath);
  const defaultImage = await Image.create(
    { data: imageData, mime_type: "image/jpeg" },
    { transaction }
  );

  return defaultImage;
};
