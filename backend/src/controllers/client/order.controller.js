const Order = require('../../models/Order');
class OrderController {
  // Tạo đơn hàng từ giỏ hàng
  static async createOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { shippingAddress } = req.body;
      const orderId = await Order.createOrderFromCart(userId, shippingAddress);
      res.status(201).json({ 
        message: 'Order created successfully', 
        orderId 
      });
    } catch (err) {
      res.status(400).json({ 
        message: err.message || 'Failed to create order' 
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId= req.params.orderId;
      const userId = req.user.userId;
      const result = await Order.getOrderById(orderId, userId);
      res.status(200).json({order: result});
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  
  // Tạo thanh toán cho đơn hàng
  static async createPayment(req, res) {
    try {
      const {orderId, amount, paymentMethod } = req.body;
      const paymentId = await Order.createPayment(orderId, amount, paymentMethod);
      res.status(201).json({ 
        message: 'Payment created successfully', 
        paymentId 
      });
    } catch (err) {
      res.status(400).json({ 
        message: err.message || 'Failed to create payment' 
      });
    }
  }

  static async getCustomerPayments(req, res) {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;
    try {
        const payments = await Order.getCustomerPayments(userId, limit, offset);
        res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
}
module.exports = OrderController;