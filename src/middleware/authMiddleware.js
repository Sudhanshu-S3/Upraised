const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');  

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists in database
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Failed to authenticate token',
        });
    }
}

const authorize = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role; // From the token

        // Convert single role to array for consistent handling
        const roles = Array.isArray(role) ? role : [role];

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: insufficient permissions',
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize,
};