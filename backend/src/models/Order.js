const OrderRepository = require('../repositories/order.repository');

const VALID_ORDER_STATUSES = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'];
const VALID_PAYMENT_METHODS = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'];

const isValidStatus = (status) => VALID_ORDER_STATUSES.includes(String(status).toUpperCase());
const normalizePaymentMethod = (method) => String(method || '').toUpperCase();
const isValidPaymentMethod = (method) => VALID_PAYMENT_METHODS.includes(normalizePaymentMethod(method));

class Order {
    // Tạo đơn hàng từ giỏ hàng
    static async createOrderFromCart(userId, shippingAddress) {
        try {
            return await OrderRepository.createOrderFromCart(userId, shippingAddress);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Lấy thông tin đơn hàng theo ID cho người dùng cụ thể
    static async getOrderById(orderId, userId) {
        try {
            return await OrderRepository.getOrderById(orderId, userId);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Tạo thanh toán cho đơn hàng
    static async createPayment(orderId, amount, paymentMethod) {
        try {
            const normalizedMethod = normalizePaymentMethod(paymentMethod);

            if (!isValidPaymentMethod(normalizedMethod)) {
                throw new Error('Unsupported payment method');
            }

            return await OrderRepository.createPayment(orderId, amount, normalizedMethod);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getCustomerPayments(userId, limit = 50, offset = 0) {
        try {
            return await OrderRepository.getCustomerPayments(userId, limit, offset);
        } catch (error) {
            throw new Error(`Error fetching customer payments: ${error.message}`);
        }
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
        const normalizedStatus = status ? status.toUpperCase() : null;
        return await OrderRepository.getAllOrders({ id, offset, limit, status: normalizedStatus });
    }

    static async updateOrderStatus(orderId, status, userId) {
        try {
            if (isValidStatus(status)) {
                return await OrderRepository.updateOrderStatus(orderId, status.toUpperCase(), userId);
            } else throw new Error('Invalid order status, cannot update');
        } catch (error) {
            throw error;
        }
    }

    static async cancelOrder(orderId, userId) {
        try {
            return await OrderRepository.cancelOrder(orderId, userId);
        } catch (error) {
            throw error;
        }
    }

    static async getDashboardStats() {
        try {
            return await OrderRepository.getDashboardStats();
        } catch (error) {
            throw new Error(`Error fetching dashboard stats: ${error.message}`);
        }
    }

    static async getSalesOverview(days) {
        try {
            return await OrderRepository.getSalesOverview(days);
        } catch (error) {
            throw new Error(`Error fetching sales overview: ${error.message}`);
        }
    }

    static async getRecentOrders(limit) {
        try {
            return await OrderRepository.getRecentOrders(limit);
        } catch (error) {
            throw new Error(`Error fetching recent orders: ${error.message}`);
        }
    }
}

module.exports = Order;
