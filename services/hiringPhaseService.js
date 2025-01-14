const { HiringPhase } = require("../models");

exports.getInitialPhase = async (phaseId) => {
  const initialPhase = await HiringPhase.findOne({ where: { id: phaseId } });
  if (!initialPhase) throw new Error("Initial hiring phase not found.");
  return initialPhase;
};

exports.getAllPhases = async () => {
  return await HiringPhase.findAll({ order: [["id", "ASC"]] });
};

exports.createPhase = async (data) => {
  return await HiringPhase.create(data);
};

exports.updatePhase = async (id, data) => {
  const phase = await HiringPhase.findByPk(id);
  if (!phase) throw new Error("Phase not found");
  phase.update({ name: data.name, sequence: data.sequence, is_final: data.isFinal });
  return await phase.save();
};

exports.deletePhase = async (id) => {
  const phase = await HiringPhase.findByPk(id);
  if (!phase) throw new Error("Phase not found");
  return await phase.destroy();
};
