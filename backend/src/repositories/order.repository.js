const db = require('../config/database');

class OrderRepository {
  static async createOrderFromCart(userId, shippingAddress) {
    const query = `
      SELECT * from public.create_order_from_cart($1, $2);
    `;
    const rows = await db.query(query, [userId, shippingAddress]);
    return rows?.[0]?.create_order_from_cart;
  }

  static async getOrderById(orderId, userId) {
    const query = `
      SELECT * FROM public.get_order($1, $2);
    `;
    const rows = await db.query(query, [userId, orderId]);
    return rows?.[0] || null;
  }

  static async getCustomerOrders(userId, limit = 50, offset = 0, status = null) {
    const query = `
      SELECT *
      FROM public.get_customer_orders($1, $2, $3, $4);
    `;
    return await db.query(query, [userId, limit, offset, status || null]);
  }

  static async createPayment(orderId, amount, paymentMethod) {
    const query = `
      SELECT public.create_payment($1, $2, $3);
    `;
    const rows = await db.query(query, [orderId, amount, paymentMethod]);
    return rows?.[0]?.create_payment;
  }

  static async getCustomerPayments(userId, limit = 50, offset = 0) {
    const query = `
      SELECT *
      FROM public.get_customer_payments($1, $2, $3);
    `;
    return await db.query(query, [userId, limit, offset]);
  }

  // Cancel order without using DB procedure (direct SQL).
  // Idempotent: if already canceled, returns { alreadyCanceled: true }.
  static async cancelOrder(orderId, userId) {
    const rows = await db.query(
      'SELECT id, customer_id, order_status FROM public.orders WHERE id = $1',
      [orderId]
    );
    const order = rows?.[0];

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    if (String(order.customer_id) !== String(userId)) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    if (String(order.order_status).toUpperCase() === 'CANCELED') {
      return { alreadyCanceled: true };
    }

    await db.query(
      'UPDATE public.orders SET order_status = $2 WHERE id = $1 AND customer_id = $3',
      [orderId, 'CANCELED', userId]
    );

    return { canceled: true };
  }

  static async getAllOrders(options) {
    const { id, offset, limit, status } = options;
    return await db.query('SELECT * FROM get_all_orders($1, $2, $3, $4)', [id, limit, offset, status]);
  }

  // Still used by admin flow; keeps existing behavior.
  static async updateOrderStatus(orderId, status, userId) {
    await db.query('CALL update_order_status($1, $2, $3);', [orderId, status, userId]);
    return true;
  }

  static async getDashboardStats() {
    const query = 'SELECT * FROM public.get_dashboard_stats()';
    const rows = await db.query(query);
    return rows?.[0] || null;
  }

  static async getSalesOverview(days) {
    const query = 'SELECT * FROM public.get_sales_overview($1)';
    return await db.query(query, [days]);
  }

  static async getRecentOrders(limit) {
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
    return await db.query(query, [limit]);
  }
}

module.exports = OrderRepository;
