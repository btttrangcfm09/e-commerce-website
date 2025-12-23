const express = require('express');
const authorizeAdmin = require('../../middleware/auth/authorize');
const { getAllOrders, getOrderById, updateOrderStatus, softDeleteOrder, downloadOrderPDF } = require('../../controllers/admin/order.controller');
const routes = express.Router();

routes.post('/list', authorizeAdmin, getAllOrders);
routes.post('/:id', authorizeAdmin, getOrderById);
routes.put('/update/:id', authorizeAdmin, updateOrderStatus);
routes.delete('/:id', authorizeAdmin, softDeleteOrder);
routes.get('/:id/pdf', authorizeAdmin, downloadOrderPDF);

module.exports = routes;
