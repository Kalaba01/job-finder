const { sequelize } = require('../models');

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully!');

    await sequelize.sync({ force: false });
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

module.exports = initDatabase;
