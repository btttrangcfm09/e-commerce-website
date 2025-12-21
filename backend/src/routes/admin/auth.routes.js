const express = require('express');
const route = express.Router();
const adminAuthController = require('../../controllers/admin/auth.controller');
const authorizeAdmin = require('../../middleware/auth/authorize');

route.post('/login', adminAuthController.login);
// Logout không cần authentication - cho phép logout ngay cả khi token hết hạn
route.get('/logout', adminAuthController.logout);

module.exports = route;
