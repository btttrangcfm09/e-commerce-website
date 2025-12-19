const UserService = require('../../services/user.service');
const User = require('../../models/User');

class UserController {
    static async signIn(req, res) {
        try {
            const { username, password } = req.body;
            const { token, filteredProfile } = await UserService.signIn(username, password);            
            res.cookie('auth', token, {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production', // for HTTPS
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/'
            });
            res.status(200).json({ message: 'Login successful', profile: filteredProfile, token: token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createAccount(req, res) {
        try {
            await UserService.createAccount(req.body); 
            res.status(201).json({ message: 'Account created successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async signOut(req, res) {
        try {
            res.clearCookie('auth');
            res.status(200).json({ message: 'Sign out successful' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            await User.updateProfile(userId, req.body);
            res.status(200).json({ message: 'Profile updated successfully',userId });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updatePassword(req, res) {
        try {
            const userId = req.user.userId;  // Get userId from token
            await User.updatePassword({ user: userId, ...req.body });
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
}

module.exports = UserController;