const { OrderRepository } = require('../repositories/order.repository');

class Order {
    // Tạo đơn hàng từ giỏ hàng
    static async createOrderFromCart(userId, shippingAddress) {
        return await OrderRepository.createOrderFromCart(userId, shippingAddress);
    }

    // Lấy thông tin đơn hàng theo ID cho người dùng cụ thể
    static async getOrderById(orderId, userId) {
        return await OrderRepository.getOrderById(orderId, userId);
    }

    // Tạo thanh toán cho đơn hàng
    static async createPayment(orderId, amount, paymentMethod) {
        return await OrderRepository.createPayment(orderId, amount, paymentMethod);
    }

    static async getCustomerPayments(userId, limit = 50, offset = 0) {
        return await OrderRepository.getCustomerPayments(userId, limit, offset);
    }

    static async getCustomerOrders(userId, limit = 50, offset = 0, status = null) {
        try {
            const normalizedStatus = status ? status.toUpperCase() : null;
            return await OrderRepository.getCustomerOrders(userId, limit, offset, normalizedStatus);
        } catch (error) {
            throw new Error(`Error fetching customer orders: ${error.message}`);
        }
    }

    static async getAllOrder(options) {
        const { id, offset, limit, status } = options;
        return await OrderRepository.getAllOrders({ id, offset, limit, status });
    }

    static async updateOrderStatus(orderId, status, userId) {
        return await OrderRepository.updateOrderStatus(orderId, status, userId);
    }

    static async cancelOrder(orderId, userId) {
        try {
            return await OrderRepository.cancelOrder(orderId, userId);
        } catch (error) {
            throw error;
        }
    }

    static async getDashboardStats() {
        return await OrderRepository.getDashboardStats();
    }

    static async getSalesOverview(days) {
        return await OrderRepository.getSalesOverview(days);
    }

    static async getRecentOrders(limit) {
        return await OrderRepository.getRecentOrders(limit);
    }
}

module.exports = Order;
