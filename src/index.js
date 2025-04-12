const app = require('./app');
const pool = require('./config/db');
const initializeDatabase = require('./config/dbInit');
require('dotenv').config();
const PORT = process.env.PORT || 5070;

async function startServer() {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');

        // Initialize database tables
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process with failure
    }
}
startServer();