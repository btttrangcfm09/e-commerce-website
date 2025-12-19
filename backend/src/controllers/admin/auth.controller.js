const authService = require('../../services/auth.service');
const userService = require('../../services/user.service');
require('dotenv').config();
exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const admin = await authService.validateAdminCredentials(username, password);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials or not an admin.' });
        }

        const profile = await userService.getUserByIdService(admin.id);
        const fieldsToExclude = ['password', 'is_active', 'created_at'];
        const filteredProfile = Object.fromEntries(
            Object.entries(profile).filter(([key]) => !fieldsToExclude.includes(key))
        );
        const accessToken = authService.generateAccessToken(admin);
        res.cookie('auth', accessToken, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production', // for HTTPS
            sameSite: 'lax', // for local development
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        return res.status(200).json({
            message: 'Login successful',
            profile: filteredProfile,
            token: accessToken,
        });
    } catch (err) {
        next(new Error(err.message));
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('auth');
        return res.status(200).json({
            message: 'Logout successful',
        });
    } catch (err) {
        next(new Error(err.message));
    }
};
