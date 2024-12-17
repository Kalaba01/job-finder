const imageService = require("../services/imageService");

exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageService.findImageById(id);

    if (!image) return res.status(404).send("Image not found");

    res.set("Content-Type", image.mime_type);
    res.send(image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Internal Server Error");
  }
};
