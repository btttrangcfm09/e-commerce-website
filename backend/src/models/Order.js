const db = require('../config/database');

class Order {
    // Tạo đơn hàng từ giỏ hàng
    static async createOrderFromCart(userId, shippingAddress) {
        try {
            const query = `
        SELECT * from public.create_order_from_cart($1, $2);
      `;
            const result = await db.query(query, [userId, shippingAddress]);

            return result[0].create_order_from_cart;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Lấy thông tin đơn hàng theo ID cho người dùng cụ thể
    static async getOrderById(orderId, userId) {
        try {
            const query = `
      SELECT * FROM public.get_order($1, $2);
    `;
            const result = await db.query(query, [userId, orderId]);
            return result[0];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Tạo thanh toán cho đơn hàng
    static async createPayment(orderId, amount, paymentMethod) {
        try {
            const query = `
        SELECT public.create_payment($1, $2, $3);
      `;
            const result = await db.query(query, [orderId, amount, paymentMethod]);
            return result[0].create_payment;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getCustomerPayments(userId, limit = 50, offset = 0) {
        try {
            const query = `
        SELECT * 
        FROM public.get_customer_payments($1, $2, $3);
    `;
            const result = await db.query(query, [userId, limit, offset]);
            return result[0].getCustomerPayments;
        } catch (error) {
            throw new Error(`Error fetching customer payments: ${error.message}`);
        }
    }

    static async getAllOrder(options) {
        const { id, offset, limit, status } = options;
        return await db.query('SELECT * FROM get_all_orders($1, $2, $3, $4)', [id, limit, offset, status || null]);
    }

    static async updateOrderStatus(orderId, status, userId) {
        try {
            if (isValidStatus(status)) {
                await db.query('CALL update_order_status($1, $2, $3', [orderId, status, userId]);
                return true;
            } else throw new Error('Invalid order status, cannot update');
        } catch (error) {
            throw error;
        }
    }

    static async getDashboardStats() {
        try {
            const query = 'SELECT * FROM public.get_dashboard_stats()';
            const result = await db.query(query);
            return result[0];
        } catch (error) {
            throw new Error(`Error fetching dashboard stats: ${error.message}`);
        }
    }

    static async getSalesOverview(days) {
        try {
            const query = 'SELECT * FROM public.get_sales_overview($1)';
            const result = await db.query(query, [days]);
            return result;
        } catch (error) {
            throw new Error(`Error fetching sales overview: ${error.message}`);
        }
    }

    static async getRecentOrders(limit) {
        try {
            const query = `
                SELECT 
                    o.*,
                    json_build_object(
                        'username', u.username,
                        'email', u.email,
                        'first_name', u.first_name,
                        'last_name', u.last_name
                    ) as customer_info
                FROM public.orders o
                JOIN public.users u ON u.id = o.customer_id
                ORDER BY o.created_at DESC
                LIMIT $1
            `;
            const result = await db.query(query, [limit]);
            return result;
        } catch (error) {
            throw new Error(`Error fetching recent orders: ${error.message}`);
        }
    }
}

module.exports = Order;
