const crypto = require('crypto');
const db = require('../config/database');

const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

class OrderRepository {
  static _newHexId(length) {
    const bytes = Math.ceil(length / 2);
    return crypto.randomBytes(bytes).toString('hex').slice(0, length);
  }

  static async _getUserRole(client, userId) {
    const { rows } = await client.query('SELECT role FROM public.users WHERE id = $1', [userId]);
    return rows?.[0]?.role || null;
  }

  static async createOrderFromCart(userId, shippingAddress) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const cartRes = await client.query('SELECT id FROM public.carts WHERE customer_id = $1 FOR UPDATE', [userId]);
      const cartId = cartRes.rows?.[0]?.id;
      if (!cartId) {
        throw new Error(`No cart found for user ${userId}`);
      }

      const itemsRes = await client.query(
        `
        SELECT
          ci.product_id,
          ci.quantity,
          p.price,
          p.stock
        FROM public.cart_items ci
        JOIN public.products p ON p.id = ci.product_id
        WHERE ci.cart_id = $1
        FOR UPDATE OF ci, p
        `,
        [cartId]
      );

      const items = itemsRes.rows || [];
      if (items.length === 0) {
        throw new Error('Cart is empty');
      }

      let totalPrice = 0;
      for (const item of items) {
        const qty = Number(item.quantity);
        const stock = Number(item.stock);
        const price = Number(item.price);
        if (!Number.isFinite(qty) || qty <= 0) {
          throw new Error('Invalid quantity in cart');
        }
        if (stock < qty) {
          throw new Error(`Not enough stock for product ${item.product_id}`);
        }
        totalPrice += price * qty;
      }

      const orderId = this._newHexId(16);
      await client.query(
        `
        INSERT INTO public.orders(
          id, customer_id, total_price, shipping_address, order_status, payment_status
        ) VALUES (
          $1, $2, $3, $4, $5::public.order_status, $6::public.payment_status
        )
        `,
        [orderId, userId, totalPrice, shippingAddress, ORDER_STATUS.PENDING, PAYMENT_STATUS.PENDING]
      );

      for (const item of items) {
        const orderItemId = this._newHexId(24);
        await client.query(
          `
          INSERT INTO public.order_items(id, order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [orderItemId, orderId, item.product_id, item.quantity, item.price]
        );

        await client.query(
          'UPDATE public.products SET stock = stock - $2 WHERE id = $1',
          [item.product_id, item.quantity]
        );

        const inventoryId = this._newHexId(8);
        await client.query(
          `
          INSERT INTO public.inventory(id, product_id, quantity, change_type)
          VALUES ($1, $2, $3, 'SALE'::public.inventory_change_type)
          `,
          [inventoryId, item.product_id, item.quantity]
        );
      }

      await client.query('DELETE FROM public.cart_items WHERE cart_id = $1', [cartId]);

      await client.query('COMMIT');
      return orderId;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async getOrderById(orderId, userId) {
    const client = await db.pool.connect();
    try {
      const role = await this._getUserRole(client, userId);
      if (!role) {
        throw new Error('User not found');
      }

      const orderRes = await client.query('SELECT * FROM public.orders WHERE id = $1', [orderId]);
      const order = orderRes.rows?.[0];
      if (!order) {
        throw new Error('Order not found');
      }

      if (role !== 'ADMIN' && String(order.customer_id) !== String(userId)) {
        throw new Error('User does not have permission to view this order');
      }

      const itemsRes = await client.query(
        `
        SELECT
          oi.id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.name as product_name
        FROM public.order_items oi
        JOIN public.products p ON p.id = oi.product_id
        WHERE oi.order_id = $1
        ORDER BY oi.created_at ASC
        `,
        [orderId]
      );

      return {
        ...order,
        items: itemsRes.rows || [],
      };
    } finally {
      client.release();
    }
  }

  static async getCustomerOrders(userId, limit = 50, offset = 0, status = null) {
    const normalizedLimit = Number(limit) || 50;
    const normalizedOffset = Number(offset) || 0;
    const normalizedStatus = status ? String(status).toUpperCase() : null;

    const query = `
      SELECT
        o.id,
        o.total_price,
        o.shipping_address,
        o.order_status,
        o.payment_status,
        o.created_at,
        (
          SELECT json_agg(json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          ))
          FROM public.order_items oi
          JOIN public.products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id
        ) as items
      FROM public.orders o
      WHERE o.customer_id = $1
        AND ($4::public.order_status IS NULL OR o.order_status = $4::public.order_status)
      ORDER BY o.created_at DESC
      LIMIT $2
      OFFSET $3
    `;

    return await db.query(query, [userId, normalizedLimit, normalizedOffset, normalizedStatus]);
  }

  static async getAllOrders({ id, limit = 100, offset = 0, status = null }) {
    const client = await db.pool.connect();
    try {
      const role = await this._getUserRole(client, id);
      if (!role) {
        throw new Error(`User ${id} not found`);
      }
      if (role !== 'ADMIN') {
        throw new Error(`User ${id} does not have permission to view all orders`);
      }

      const query = `
        SELECT
          o.id,
          o.customer_id,
          o.total_price,
          o.shipping_address,
          o.order_status,
          o.payment_status,
          o.created_at,
          json_build_object(
            'username', u.username,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name
          ) as customer_info
        FROM public.orders o
        JOIN public.users u ON u.id = o.customer_id
        WHERE ($4::public.order_status IS NULL OR o.order_status = $4::public.order_status)
        ORDER BY o.created_at DESC
        LIMIT $2
        OFFSET $3
      `;

      const { rows } = await client.query(query, [id, Number(limit) || 100, Number(offset) || 0, status ? String(status).toUpperCase() : null]);
      return rows;
    } finally {
      client.release();
    }
  }

  static async updateOrderStatus(orderId, newStatus, userId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const role = await this._getUserRole(client, userId);
      if (!role) {
        throw new Error(`User ${userId} not found`);
      }

      const orderRes = await client.query(
        'SELECT id, customer_id, order_status FROM public.orders WHERE id = $1 FOR UPDATE',
        [orderId]
      );
      const order = orderRes.rows?.[0];
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      const currentStatus = String(order.order_status).toUpperCase();
      const normalizedNewStatus = String(newStatus || '').toUpperCase();

      if (currentStatus === ORDER_STATUS.CANCELED) {
        throw new Error('Cannot update canceled order');
      }

      if (currentStatus === ORDER_STATUS.DELIVERED && normalizedNewStatus !== ORDER_STATUS.CANCELED) {
        throw new Error('Cannot update delivered order');
      }

      const isAdmin = role === 'ADMIN';
      const isCustomerCancel = role === 'CUSTOMER' && String(order.customer_id) === String(userId) && normalizedNewStatus === ORDER_STATUS.CANCELED;
      if (!isAdmin && !isCustomerCancel) {
        throw new Error('Unauthorized status change attempt');
      }

      // Keep trigger behavior (order_status_history) consistent if DB uses current_setting.
      // Use set_config() instead of SET LOCAL because placeholders like $1 are not accepted in some utility commands.
      await client.query("SELECT set_config('app.current_user_id', $1::text, true)", [String(userId)]);

      await client.query(
        'UPDATE public.orders SET order_status = $2::public.order_status WHERE id = $1',
        [orderId, normalizedNewStatus]
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async cancelOrder(orderId, userId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const orderRes = await client.query(
        'SELECT id, customer_id, order_status FROM public.orders WHERE id = $1 FOR UPDATE',
        [orderId]
      );
      const order = orderRes.rows?.[0];
      if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
      }

      if (String(order.customer_id) !== String(userId)) {
        const err = new Error('User does not have permission to cancel this order');
        err.statusCode = 403;
        throw err;
      }

      if (String(order.order_status).toUpperCase() === ORDER_STATUS.CANCELED) {
        await client.query('COMMIT');
        return { alreadyCanceled: true };
      }

      if (String(order.order_status).toUpperCase() === ORDER_STATUS.DELIVERED) {
        const err = new Error('Cannot cancel delivered order');
        err.statusCode = 400;
        throw err;
      }

      await client.query("SELECT set_config('app.current_user_id', $1::text, true)", [String(userId)]);
      await client.query(
        'UPDATE public.orders SET order_status = $2::public.order_status WHERE id = $1',
        [orderId, ORDER_STATUS.CANCELED]
      );

      await client.query('COMMIT');
      return { alreadyCanceled: false };
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async createPayment(orderId, amount, paymentMethod, userId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const role = userId ? await this._getUserRole(client, userId) : null;
      if (userId && !role) {
        throw new Error(`User ${userId} not found`);
      }

      const orderRes = await client.query(
        'SELECT id, customer_id, total_price, payment_status FROM public.orders WHERE id = $1 FOR UPDATE',
        [orderId]
      );
      const order = orderRes.rows?.[0];
      if (!order) {
        throw new Error('Invalid order or payment already processed');
      }

      if (role === 'CUSTOMER' && String(order.customer_id) !== String(userId)) {
        throw new Error('User does not have permission to pay for this order');
      }

      if (String(order.payment_status).toUpperCase() !== PAYMENT_STATUS.PENDING) {
        throw new Error('Invalid order or payment already processed');
      }

      const normalizedAmount = Number(amount);
      if (!Number.isFinite(normalizedAmount) || normalizedAmount < 0) {
        throw new Error('Invalid payment amount');
      }

      const orderTotal = Number(order.total_price);
      if (normalizedAmount !== orderTotal) {
        throw new Error('Payment amount does not match order total');
      }

      const paymentId = this._newHexId(28).toUpperCase();
      await client.query(
        `
        INSERT INTO public.payments(
          id, order_id, amount, payment_status, payment_method, created_at
        ) VALUES (
          $1, $2, $3, $4::public.payment_status, $5::public.payment_method, current_timestamp
        )
        `,
        [paymentId, orderId, normalizedAmount, PAYMENT_STATUS.PENDING, paymentMethod]
      );

      // NOTE: We intentionally keep order.payment_status update logic in DB trigger (if present).
      await client.query('COMMIT');
      return paymentId;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async getCustomerPayments(userId, limit = 50, offset = 0) {
    const normalizedLimit = Number(limit) || 50;
    const normalizedOffset = Number(offset) || 0;

    const query = `
      SELECT
        p.id,
        p.order_id,
        p.amount,
        p.payment_status,
        p.payment_method,
        p.created_at,
        json_build_object(
          'order_status', o.order_status,
          'total_price', o.total_price,
          'items_count', (
            SELECT count(*)
            FROM public.order_items oi
            WHERE oi.order_id = o.id
          )
        ) as order_info
      FROM public.payments p
      JOIN public.orders o ON o.id = p.order_id
      WHERE o.customer_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2
      OFFSET $3
    `;

    return await db.query(query, [userId, normalizedLimit, normalizedOffset]);
  }

  static async getDashboardStats() {
    const query = `
      SELECT
        coalesce(sum(total_price), 0) as total_revenue,
        count(*) as total_orders,
        count(distinct customer_id) as active_customers,
        (select count(*) from public.products where stock < 10) as low_stock_products
      FROM public.orders
      WHERE created_at >= date_trunc('month', current_date)
    `;

    const rows = await db.query(query);
    return rows?.[0] || null;
  }

  static async getSalesOverview(days = 7) {
    const normalizedDays = Number(days) || 7;
    const query = `
      SELECT
        date_trunc('day', created_at)::date as date,
        sum(total_price) as sales,
        count(*) as orders
      FROM public.orders
      WHERE created_at >= current_date - ($1::text || ' days')::interval
      GROUP BY 1
      ORDER BY 1
    `;
    return await db.query(query, [String(normalizedDays)]);
  }

  static async getRecentOrders(limit = 10) {
    const normalizedLimit = Number(limit) || 10;
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
    return await db.query(query, [normalizedLimit]);
  }
}

module.exports = {
  OrderRepository,
  ORDER_STATUS,
  PAYMENT_STATUS,
};
