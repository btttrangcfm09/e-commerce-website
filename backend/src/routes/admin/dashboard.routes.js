const express = require('express');
const authorizeAdmin = require('../../middleware/auth/authorize');
const dashboardController = require('../../controllers/admin/dashboard.controller');
const routes = express.Router();

routes.get('/stat-overview', authorizeAdmin, dashboardController.getDashboardStats);
routes.get('/stat-chart', authorizeAdmin, dashboardController.getSalesOverview);
routes.get('/recent-order', authorizeAdmin, dashboardController.getRecentOrders);

module.exports = routes;
