const pool = require('./db');

async function initializeDatabase() {
    try {
        // Create gadgets table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gadgets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10,2),
                self_destruct_time BIGINT
            );
        `);
        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = initializeDatabase;