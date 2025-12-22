const express = require('express');
const UserController = require('../../controllers/client/user.controller');
const PasswordController = require('../../controllers/client/password.controller');
const authenticate = require('../../middleware/auth/authenticate');
const { uploadProfileImage } = require('../../middleware/upload.middleware');
const router = express.Router();

router.post('/signin', UserController.signIn);
router.post('/signup', UserController.createAccount);
router.post('/logout', UserController.signOut);
router.put('/profile', authenticate, uploadProfileImage, UserController.updateProfile);
router.post('/profile/image', authenticate, uploadProfileImage, UserController.updateProfileImage);
router.delete('/profile/image', authenticate, UserController.deleteProfileImage);

// Password change with email verification code
router.post('/password/change/request', authenticate, PasswordController.requestChangeCode);
router.post('/password/change/confirm', authenticate, PasswordController.confirmChange);

// Legacy endpoint (kept for backward compatibility)
router.put('/password', authenticate, UserController.updatePassword);
router.get('/check', authenticate, (req, res) => {
  res.status(200).json({ message: 'User is authenticated', user: req.user });
});

module.exports = router;
