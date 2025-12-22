// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/auth/authenticate');

// Route kiểm tra JWT
router.get('/check', authenticateJWT, (req, res) => {
  res.status(200).json({ message: 'User is authenticated', user: req.user });
});

module.exports = router;
