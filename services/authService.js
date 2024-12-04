const bcrypt = require('bcrypt');
const { User, Candidate } = require('../models');

// Registracija kandidata
exports.registerCandidate = async (candidateData) => {
  const { email, password, first_name, last_name } = candidateData;

  // Proveri da li već postoji korisnik sa istim email-om
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  // Kreiraj korisnika
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role: 'Candidate',
  });

  // Kreiraj kandidata
  const candidate = await Candidate.create({
    user_id: user.id,
    first_name,
    last_name,
  });

  return candidate;
};
