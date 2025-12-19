const jwt = require('jsonwebtoken');
const db = require('../../config/database');

async function authorizeAdmin(req, res, next) {
    try {
        const token = req.cookies.auth || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [user] = await db.query('SELECT id, role FROM users WHERE id = $1', [decoded.userId]);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = { ...decoded, role: user.role };
        next();
    } catch (error) {
        res.clearCookie('auth');
        return res.status(401).json({ message: 'Authentication failed' });
    }
}

module.exports = authorizeAdmin;