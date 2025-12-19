const express = require('express');
const route = express.Router();
const adminAuthController = require('../../controllers/admin/auth.controller');
const authorizeAdmin = require('../../middleware/auth/authorize');

route.post('/login', adminAuthController.login);
route.get('/logout', authorizeAdmin, adminAuthController.logout);

module.exports = route;
