const { OrderRepository, ORDER_STATUS } = require('../repositories/order.repository');
const EmailService = require('./email.service');
const UserRepository = require('../repositories/user.repository');

const SUPPORTED_PAYMENT_METHODS = Object.freeze(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']);

const normalizePaymentMethod = (paymentMethod) => {
    const input = String(paymentMethod || '').trim();
    if (!input) return '';

    // Convert camelCase -> snake_case, then normalize separators.
    const snake = input
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .toUpperCase();

    // Common aliases from frontend/UI
    const ALIASES = {
        CREDITCARD: 'CREDIT_CARD',
        CREDIT_CARD: 'CREDIT_CARD',
        DEBITCARD: 'DEBIT_CARD',
        DEBIT_CARD: 'DEBIT_CARD',
        PAYPAL: 'PAYPAL',
        BANKTRANSFER: 'DEBIT_CARD',
        BANK_TRANSFER: 'DEBIT_CARD',
    };

    // Remove underscores for a second lookup (e.g. CREDIT_CARD -> CREDITCARD)
    const compact = snake.replace(/_/g, '');
    return ALIASES[snake] || ALIASES[compact] || snake;
};

const normalizeOrderStatus = (status) => {
    return String(status || '').trim().toUpperCase();
};

class OrderService {
    static async createOrderFromCart(userId, shippingAddress) {
        if (!shippingAddress) {
            throw new Error('Shipping address is required');
        }

        const orderId = await OrderRepository.createOrderFromCart(userId, shippingAddress);

        // Best-effort email confirmation: do not fail the order if mail is not configured.
        try {
            if (EmailService.isConfigured()) {
                const user = await UserRepository.findById(userId);
                if (user?.email) {
                    const order = await OrderRepository.getOrderById(orderId, userId);
                    await EmailService.sendOrderConfirmation({ to: user.email, order });
                }
            }
        } catch (err) {
            // Log only; keep API behavior intact.
            console.warn('Order confirmation email failed:', err?.message || err);
        }

        return orderId;
    }

    static async getOrderById(orderId, userId) {
        if (!orderId) {
            throw new Error('Order id is required');
        }
        const order = await OrderRepository.getOrderById(orderId, userId);
        console.log(order);
        return order;
    }

    static async getCustomerOrders(userId, limit = 50, offset = 0, status = null) {
        return await OrderRepository.getCustomerOrders(userId, limit, offset, status);
    }

    static async cancelOrderService(orderId, userId) {
        if (!orderId) {
            throw new Error('Order id is required');
        }
        return await OrderRepository.cancelOrder(orderId, userId);
    }

    static async createPayment(orderId, amount, paymentMethod, userId) {
        if (!orderId) {
            throw new Error('Order id is required');
        }

        const normalizedMethod = normalizePaymentMethod(paymentMethod);
        if (!SUPPORTED_PAYMENT_METHODS.includes(normalizedMethod)) {
            throw new Error(
                `Unsupported payment method: ${String(paymentMethod)}. Supported: ${SUPPORTED_PAYMENT_METHODS.join(', ')}`
            );
        }

        let resolvedAmount = amount;
        if (resolvedAmount === undefined || resolvedAmount === null || resolvedAmount === '') {
            const order = await this.getOrderById(orderId, userId);
            resolvedAmount = order?.total_price;
        }

        return await OrderRepository.createPayment(orderId, resolvedAmount, normalizedMethod, userId);
    }

    static async getCustomerPayments(userId, limit = 50, offset = 0) {
        return await OrderRepository.getCustomerPayments(userId, limit, offset);
    }

    static async getAllOrdersService(options) {
        const normalizedStatus = options?.status ? normalizeOrderStatus(options.status) : null;
        const order = await OrderRepository.getAllOrders({
            ...options,
            status: normalizedStatus,
        });
        return order;
    }

    static async updateOrderStatusService(orderId, status, userId) {
        const normalizedStatus = normalizeOrderStatus(status);
        const allowed = Object.values(ORDER_STATUS);

        if (!allowed.includes(normalizedStatus)) {
            throw new Error('Invalid order status, cannot update');
        }
        return await OrderRepository.updateOrderStatus(orderId, normalizedStatus, userId);
    }

    static async getDashboardStats() {
        return await OrderRepository.getDashboardStats();
    }

    static async getSalesOverview(days = 7) {
        return await OrderRepository.getSalesOverview(days);
    }

    static async getRecentOrders(limit = 10) {
        return await OrderRepository.getRecentOrders(limit);
    }

    static async softDeleteOrder(orderId, userId) {
        if (!orderId) {
            throw new Error('Order id is required');
        }
        return await OrderRepository.softDeleteOrder(orderId, userId);
    }

    static async getOrderDetailsForPDF(orderId, userId) {
        if (!orderId) {
            throw new Error('Order id is required');
        }
        return await OrderRepository.getOrderDetailsForPDF(orderId, userId);
    }
}

module.exports = OrderService;