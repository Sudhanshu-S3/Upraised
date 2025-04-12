const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create({ username, email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Include role in the token
        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in user',
            error: error.message,
        });
    }
};
const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to set req.user from the token

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message,
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        // Implement admin functionality to get all users
        // This is just a placeholder for the authorize middleware example
        res.status(200).json({
            success: true,
            message: 'Admin access granted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error accessing admin resource',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers
};