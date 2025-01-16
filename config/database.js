require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool using environment variables
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = pool;
