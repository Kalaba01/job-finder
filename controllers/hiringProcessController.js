const hiringProcessService = require("../services/hiringProcessService");

exports.getFirmHiringProcesses = async (req, res) => {
    try {
      const { processes, uniqueCategories, phases } = await hiringProcessService.getFirmHiringProcesses(req.user.id);
  
      res.render("firm/firm-hiring-processes", { hiringProcesses: processes, uniqueCategories, phases });
    } catch (error) {
      console.error("Error fetching firm hiring processes:", error.message || error);
      res.status(500).send("An error occurred while fetching hiring processes.");
    }
};
