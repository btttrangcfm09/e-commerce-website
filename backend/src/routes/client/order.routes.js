const express = require('express');
const OrderController = require('../../controllers/client/order.controller');
const authenticate = require('../../middleware/auth/authenticate');
const router = express.Router();

// Tạo đơn hàng từ giỏ hàng
router.post('/create', authenticate, OrderController.createOrder);

// Tạo thanh toán cho đơn hàng
router.post('/payments', authenticate, OrderController.createPayment);
// Tạo Stripe PaymentIntent (sandbox)
router.post('/stripe/intent', authenticate, OrderController.createStripePaymentIntent);
// Xác nhận payment sau khi client hoàn thành thanh toán với Stripe
router.post('/stripe/confirm', authenticate, OrderController.confirmStripePayment);

// Lịch sử thanh toán của khách hàng hiện tại
router.get('/payments', authenticate, OrderController.getCustomerPayments);

// Danh sách đơn hàng của khách hàng
router.get('/', authenticate, OrderController.getCustomerOrders);

// Hủy đơn hàng (khách hàng)
router.patch('/:orderId/cancel', authenticate, OrderController.cancelOrder);

// Lấy thông tin đơn hàng theo ID
router.get('/:orderId',authenticate, OrderController.getOrderById);

module.exports = router;