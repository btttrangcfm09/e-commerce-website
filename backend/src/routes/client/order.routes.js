const express = require('express');
const OrderController = require('../../controllers/client/order.controller');
const authenticate = require('../../middleware/auth/authenticate');
const router = express.Router();

// Tạo đơn hàng từ giỏ hàng
router.post('/create', authenticate, OrderController.createOrder);

// Lấy thông tin đơn hàng theo ID
router.get('/:orderId',authenticate, OrderController.getOrderById);

// Tạo thanh toán cho đơn hàng
router.post('/payments',authenticate, OrderController.createPayment);

router.get('/payments/:userId', authenticate, OrderController.getCustomerPayments);

module.exports = router;