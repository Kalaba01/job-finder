const { HiringPhase } = require("../models");

// Fetch an initial hiring phase based on its ID
exports.getInitialPhase = async (phaseId) => {
  const initialPhase = await HiringPhase.findOne({ where: { id: phaseId } });
  if (!initialPhase) throw new Error("Initial hiring phase not found.");
  return initialPhase;
};

// Retrieve all hiring phases
exports.getAllPhases = async () => {
  return await HiringPhase.findAll({ order: [["id", "ASC"]] });
};

// Create a new hiring phase
exports.createPhase = async (data) => {
  return await HiringPhase.create({ name: data.name, sequence: data.sequence, is_final: data.isFinal });
};

// Update an existing hiring phase
exports.updatePhase = async (id, data) => {
  const phase = await HiringPhase.findByPk(id);
  if (!phase) throw new Error("Phase not found");
  phase.update({ name: data.name, sequence: data.sequence, is_final: data.isFinal });
  return await phase.save();
};

// Delete a hiring phase
exports.deletePhase = async (id) => {
  const phase = await HiringPhase.findByPk(id);
  if (!phase) throw new Error("Phase not found");
  return await phase.destroy();
};
