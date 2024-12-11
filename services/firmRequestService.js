const { FirmRequest } = require("../models");

exports.getAllFirmRequests = async () => {
  try {
    return await FirmRequest.findAll({ order: [["createdAt", "DESC"]] });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    throw new Error("Error fetching firm requests.");
  }
};

exports.updateFirmRequestStatus = async (id, status) => {
  try {
    return await FirmRequest.update({ status }, { where: { id } });
  } catch (error) {
    console.error("Error updating firm request:", error);
    throw new Error("Error updating firm request.");
  }
};
