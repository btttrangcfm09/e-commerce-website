const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.validateAdminCredentials = async (username, password) => {
    try {
        // Query to validate user credentials using raw SQL (keeping the same query structure)

        const result = await pool.query('SELECT * from signin($1, $2)', [username, password]);

        if (!result[0].signin) throw new Error('Wrong username or password');

        const role = await pool.query('SELECT role,id FROM users WHERE username = $1', [username]);

        if (role[0].role !== 'ADMIN') {
            const error = new Error('Unauthorized. User is not an admin.');
            error.statusCode = 403;
            throw error;
        }

        return {
            id: role[0].id,
            username: username,
            role: role[0].role,
        };
    } catch (err) {
        throw err; // Pass the error to the middleware
    }
};

exports.generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};
