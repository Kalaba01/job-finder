const { HiringPhase } = require("../models");

exports.getInitialPhase = async (phaseId) => {
  const initialPhase = await HiringPhase.findOne({ where: { id: phaseId } });
  if (!initialPhase) throw new Error("Initial hiring phase not found.");
  return initialPhase;
};
