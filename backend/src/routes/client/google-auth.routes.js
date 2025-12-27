const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const jwt = require('jsonwebtoken');
const { toPublicUser } = require('../../models/user.model');

// Route để bắt đầu đăng nhập Google
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false 
    })
);

// Callback route sau khi Google xác thực
router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false,
        failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173/login?error=google_auth_failed'
    }),
    (req, res) => {
        try {
            // Tạo JWT token cho user
            const token = jwt.sign(
                { userId: req.user.id, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Chuẩn hóa profile
            const publicProfile = toPublicUser(req.user);

            // Redirect về frontend với token và profile
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            
            // Encode token và profile để truyền qua URL
            const encodedToken = encodeURIComponent(token);
            const encodedProfile = encodeURIComponent(JSON.stringify(publicProfile));
            
            res.redirect(`${frontendUrl}/auth/google/callback?token=${encodedToken}&profile=${encodedProfile}`);
        } catch (error) {
            console.error('Google callback error:', error);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/login?error=callback_failed`);
        }
    }
);

module.exports = router;
