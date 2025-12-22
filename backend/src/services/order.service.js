const Order = require('../models/Order');

class OrderService {
    // Tạo đơn hàng từ giỏ hàng
    static async createOrderFromCart(userId, shippingAddress) {
        return await Order.createOrderFromCart(userId, shippingAddress);
    }

    // Lấy thông tin đơn hàng theo ID
    static async getOrderById(orderId, userId) {
        return await Order.getOrderById(orderId, userId);
    }

    static async createPayment(orderId, amount, paymentMethod) {
        return await Order.createPayment(orderId, amount, paymentMethod);
    }

    static async getCustomerPayments(userId, limit, offset) {
        return await Order.getCustomerPayments(userId, limit, offset);
    }

    static async getCustomerOrders(userId, limit, offset, status) {
        return await Order.getCustomerOrders(userId, limit, offset, status);
    }

    static async getAllOrdersService(options) {
        return await Order.getAllOrder(options);
    }

    static async updateOrderStatusService(orderId, status, userId) {
        return await Order.updateOrderStatus(orderId, status, userId);
    }

    static async cancelOrderService(orderId, userId) {
        return await Order.cancelOrder(orderId, userId);
    }
}

module.exports = OrderService;