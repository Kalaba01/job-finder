const hiringPhaseService = require("../services/hiringPhaseService");

exports.getHiringPhases = async (req, res) => {
  try {
    const hiringPhases = await hiringPhaseService.getAllPhases();
    res.render("admin/admin-maintenance", { hiringPhases, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching hiring phases:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createHiringPhase = async (req, res) => {
  try {
    const { name, sequence, isFinal } = req.body;
    const newPhase = await hiringPhaseService.createPhase({ name, sequence, isFinal });
    res.status(201).json(newPhase);
  } catch (error) {
    console.error("Error creating hiring phase:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editHiringPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sequence, isFinal } = req.body;
    const updatedPhase = await hiringPhaseService.updatePhase(id, { name, sequence, isFinal });
    res.status(200).json(updatedPhase);
  } catch (error) {
    console.error("Error editing hiring phase:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteHiringPhase = async (req, res) => {
  try {
    const { id } = req.params;
    await hiringPhaseService.deletePhase(id);
    res.status(200).send("Phase deleted successfully");
  } catch (error) {
    console.error("Error deleting hiring phase:", error);
    res.status(500).send("Internal Server Error");
  }
};
