const UserService = require('../../services/user.service');
const ProfileService = require('../../services/profile.service');
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
            res.status(200).json({ success: true, message: 'Login successful', profile: filteredProfile, token: token });
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

    static async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            const profile = await ProfileService.getMyProfile(userId);
            res.status(200).json({ profile });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const profile = await ProfileService.updateMyProfile(userId, req.body);
            res.status(200).json({ message: 'Profile updated successfully', profile });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async updateProfileImage(req, res) {
        try {
            const userId = req.user.userId;
            // uploadProfileImage middleware sẽ set req.body.image (Google Drive link)
            const profile = await ProfileService.updateMyProfile(userId, { image: req.body.image });
            res.status(200).json({ message: 'Profile image updated successfully', profile });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async deleteProfileImage(req, res) {
        try {
            const userId = req.user.userId;
            const profile = await ProfileService.deleteMyProfileImage(userId);
            res.status(200).json({ message: 'Profile image deleted successfully', profile });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
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