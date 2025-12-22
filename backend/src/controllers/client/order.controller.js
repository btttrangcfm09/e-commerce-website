const OrderService = require('../../services/order.service');
class OrderController {
  // Tạo đơn hàng từ giỏ hàng
  static async createOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { shippingAddress } = req.body;
      if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required' });
      }

      const orderId = await OrderService.createOrderFromCart(userId, shippingAddress);
      return res.status(201).json({ 
        message: 'Order created successfully', 
        orderId 
      });
    } catch (err) {
      return res.status(400).json({ 
        message: err.message || 'Failed to create order' 
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      const userId = req.user.userId;
      const result = await OrderService.getOrderById(orderId, userId);
      return res.status(200).json({ order: result });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }

  // Danh sách đơn hàng của khách hàng
  static async getCustomerOrders(req, res) {
    const userId = req.user.userId;
    const { limit = 50, offset = 0, status = null } = req.query;

    try {
      const orders = await OrderService.getCustomerOrders(userId, Number(limit), Number(offset), status || null);
      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Khách hàng hủy đơn (chỉ đơn của chính mình)
  static async cancelOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { orderId } = req.params;

      const result = await OrderService.cancelOrderService(orderId, userId);
      const already = Boolean(result?.alreadyCanceled);
      return res.status(200).json({
        success: true,
        alreadyCanceled: already,
        message: already ? 'Order has already been canceled' : 'Order canceled successfully',
      });
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to cancel order',
      });
    }
  }
  
  // Tạo thanh toán cho đơn hàng
  static async createPayment(req, res) {
    try {
      const userId = req.user.userId;
      const {orderId, amount, paymentMethod } = req.body;

      const paymentId = await OrderService.createPayment(orderId, amount, paymentMethod, userId);
      return res.status(201).json({ 
        message: 'Payment created successfully', 
        paymentId 
      });
    } catch (err) {
      return res.status(400).json({ 
        message: err.message || 'Failed to create payment' 
      });
    }
  }

  static async getCustomerPayments(req, res) {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;
    try {
      const payments = await OrderService.getCustomerPayments(userId, Number(limit), Number(offset));
      return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
      return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
}
module.exports = OrderController;