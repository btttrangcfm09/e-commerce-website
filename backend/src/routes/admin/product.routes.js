const express = require('express');
const route = express.Router();
const adminProductController = require('../../controllers/admin/product.controller');
const authorizeAdmin = require('../../middleware/auth/authorize');
const { checkFileUpload } = require('../../middleware/upload.middleware');

route.get('/', authorizeAdmin, adminProductController.get);

route.post('/add', authorizeAdmin, adminProductController.addProduct);

route.put('/edit/:id', authorizeAdmin, adminProductController.editProduct);

// route.get('/product/:id', authorizeAdmin, adminProductController.getProduct);

module.exports = route;
