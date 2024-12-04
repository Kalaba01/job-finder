const bcrypt = require('bcrypt');
const { User, Candidate } = require('../models');

exports.registerCandidate = async (candidateData) => {
  const { email, password, first_name, last_name } = candidateData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role: 'candidate',
  });

  const candidate = await Candidate.create({
    user_id: user.id,
    first_name,
    last_name,
  });

  return candidate;
};

exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
