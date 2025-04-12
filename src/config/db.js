const { Pool } = require('pg');
require('dotenv').config();

let poolConfig;

poolConfig = {
    connectionString: process.env.RENDER_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

// Add these event handlers
pool.on('error', (err, client) => {
    console.error('Unexpected database error:', err.message);
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

module.exports = pool;
