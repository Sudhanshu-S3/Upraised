const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

//Routes
const gadgetRouter = require('./routes/gadgetRoutes');
const authRouter = require('./routes/authRoutes');
//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes using
app.use('/api/gadgets', gadgetRouter);
app.use('/api/auth', authRouter);

//Health check route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to IMF Gadget API v1.0',
    });
});

//Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});

module.exports = app;
