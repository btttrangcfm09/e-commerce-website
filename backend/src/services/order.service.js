const Order = require('../models/Order');

class OrderService {
    // Tạo đơn hàng từ giỏ hàng
    static async createOrderFromCart(userId, shippingAddress) {
        try {
            return await Order.createOrderFromCart(userId, shippingAddress);
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin đơn hàng theo ID
    static async getOrderById(orderId, userId) {
        try {
            return await Order.getOrderById(orderId, userId);
        } catch (error) {
            throw error;
        }
    }

  // Tạo thanh toán cho đơn hàng
  static async createPayment(orderId, amount, paymentMethod) {
      return await Order.createPayment(orderId, amount, paymentMethod);

  }

  static async getCustomerPayments(userId, limit, offset) {
    return await CustomerPaymentModel.getCustomerPayments(userId, limit, offset);
  
  }

    // Lấy các sản phẩm trong đơn hàng
    static async getOrderItems(orderId) {
        try {
            return await Order.getOrderItems(orderId);
        } catch (error) {
            throw error;
        }
    }

    static async getAllOrdersService(options) {
        try {
            return await Order.getAllOrder(options);
        } catch (error) {
            throw error;
        }
    }

    static async updateOrderStatusService(order_id, status, id) {
        try {
            return await Order.updateOrderStatus(order_id, status, id);
        } catch (error) {
            throw error;
        }
    }

    
}

module.exports = OrderService;