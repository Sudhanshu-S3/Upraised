const pool = require('./db');

async function initializeDatabase() {
    try {
        // First, enable the pgcrypto extension if not already enabled
        await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

        // Create gadgets table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gadgets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10,2),
                codename VARCHAR(255) NOT NULL,
                status VARCHAR(20) DEFAULT 'Available',
                decommissioned_at TIMESTAMP,
                self_destruct_time BIGINT
            );
        `);

        // Create users table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = initializeDatabase;