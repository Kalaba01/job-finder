const authService = require('../services/authService');

exports.registerCandidate = async (req, res) => {
  try {
    const candidateData = req.body;
    const result = await authService.registerCandidate(candidateData);

    res.status(201).json({
      message: 'Candidate registered successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
