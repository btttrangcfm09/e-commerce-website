/**
 * Optional Authentication Middleware
 * Purpose: Check for authentication but don't require it
 * Attaches user info if logged in, allows request to proceed if not
 */

const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const optionalAuth = async (req, res, next) => {
    try {
        // Try to get token from cookie or Authorization header
        const token = req.cookies?.token || 
                     (req.headers.authorization?.startsWith('Bearer ') 
                         ? req.headers.authorization.substring(7) 
                         : null);

        // If no token, proceed as guest user
        if (!token) {
            req.user = null;
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user info
        const user = await User.findById(decoded.id);

        if (user) {
            req.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };
        } else {
            req.user = null;
        }

        next();

    } catch (error) {
        // If token is invalid, proceed as guest
        req.user = null;
        next();
    }
};

module.exports = { optionalAuth };
