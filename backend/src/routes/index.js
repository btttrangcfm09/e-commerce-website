const express = require('express');
const router = express.Router();

// Import routes cho admin
const adminAuthRoutes = require('./admin/auth.routes');
const adminDashboardRoutes = require('./admin/dashboard.routes');
const adminProductRoutes = require('./admin/product.routes');
const adminUserRoutes = require('./admin/user.routes');
const adminOrderRoutes = require('./admin/order.routes');

// Import routes cho client
const clientRoutes = require('./client/user.routes');
const clientCartRoutes = require('./client/cart.routes');
const clientOrderRoutes = require('./client/order.routes');
const clientCategoryRoutes = require('./client/category.routes');
const clientProductRoutes = require('./client/product.routes');
const clientFavoriteRoutes = require('./client/favorite.routes');
const clientAIChatRoutes = require('./client/ai-chat.routes');

// Gắn các route admin
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/admin/users', adminUserRoutes);
router.use('/admin/orders', adminOrderRoutes);

// Gắn các route client
router.use('/client', clientRoutes);
router.use('/client/cart', clientCartRoutes);
router.use('/client/orders', clientOrderRoutes);
router.use('/categories', clientCategoryRoutes);
router.use('/products', clientProductRoutes);
router.use('/categories', clientCategoryRoutes);
router.use('/client/favorites', clientFavoriteRoutes);
router.use('/client/ai-chat', clientAIChatRoutes);

module.exports = router;
