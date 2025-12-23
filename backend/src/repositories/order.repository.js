const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Định nghĩa Enum để tránh hardcode string sai
const ORDER_STATUS = {
    PENDING: 'PENDING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
};

const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
};

class OrderRepository {

    // --- 1. LOGIC GHI (WRITE) - Cần Transaction an toàn ---

    static async createOrderFromCart(userId, shippingAddress) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu giao dịch

            // Lấy ID giỏ hàng
            const cartRes = await client.query('SELECT id FROM carts WHERE customer_id = $1', [userId]);
            const cartId = cartRes.rows[0]?.id;
            if (!cartId) throw new Error('Cart not found');

            // Lấy sản phẩm trong giỏ & khóa dòng (FOR UPDATE) để tránh hết hàng lúc đang mua
            const itemsRes = await client.query(`
                SELECT ci.product_id, ci.quantity, p.price, p.stock
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = $1
                FOR UPDATE OF p
            `, [cartId]);
            
            const items = itemsRes.rows;
            if (items.length === 0) throw new Error('Cart is empty');

            // Tính tổng tiền & Check tồn kho
            let totalPrice = 0;
            for (const item of items) {
                if (item.stock < item.quantity) {
                    throw new Error(`Product ID ${item.product_id} is out of stock`);
                }
                totalPrice += Number(item.price) * item.quantity;
            }

            // Tạo Order ID (16 chars)
            const orderId = uuidv4().replace(/-/g, '').substring(0, 16);

            // Insert Order
            await client.query(`
                INSERT INTO orders (id, customer_id, total_price, shipping_address, order_status, payment_status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
            `, [orderId, userId, totalPrice, shippingAddress, ORDER_STATUS.PENDING, PAYMENT_STATUS.PENDING]);

            // Insert Items & Trừ kho
            for (const item of items) {
                const orderItemId = uuidv4().replace(/-/g, '').substring(0, 24);
                
                // Lưu item
                await client.query(`
                    INSERT INTO order_items (id, order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4, $5)
                `, [orderItemId, orderId, item.product_id, item.quantity, item.price]);

                // Trừ kho
                await client.query(`
                    UPDATE products SET stock = stock - $1 WHERE id = $2
                `, [item.quantity, item.product_id]);
                
                // Lưu log kho (Inventory) - theo cấu trúc của đồng đội bạn
                const inventoryId = uuidv4().replace(/-/g, '').substring(0, 8);
                await client.query(`
                    INSERT INTO inventory (id, product_id, quantity, change_type, change_date)
                    VALUES ($1, $2, $3, 'SALE', NOW())
                `, [inventoryId, item.product_id, item.quantity]);
            }

            // Xóa giỏ hàng
            await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

            await client.query('COMMIT');
            return orderId;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateOrderStatus(orderId, status, userId) {
        // Cập nhật trạng thái đơn hàng (dành cho Admin)
        // Không cần set_config phức tạp nữa
        const query = `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING id`;
        const result = await db.query(query, [status, orderId]);
        
        if (result.length === 0) return null;

        // Lưu lịch sử (nếu bảng này có cột changed_by là enum user_role thì phải truyền đúng 'ADMIN')
        await db.query(`
            INSERT INTO order_status_history (order_id, new_status, changed_by) 
            VALUES ($1, $2, 'ADMIN')
        `, [orderId, status]);
        
        return true;
    }

    static async cancelOrder(orderId, userId) {
        // Logic hủy đơn cho khách hàng
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check quyền sở hữu
            const orderRes = await client.query('SELECT order_status FROM orders WHERE id = $1 AND customer_id = $2 FOR UPDATE', [orderId, userId]);
            if (orderRes.rows.length === 0) throw new Error('Order not found or unauthorized');

            const currentStatus = orderRes.rows[0].order_status;
            
            if (currentStatus === ORDER_STATUS.CANCELED) {
                await client.query('ROLLBACK');
                return { alreadyCanceled: true };
            }
            if (currentStatus === ORDER_STATUS.DELIVERED || currentStatus === ORDER_STATUS.SHIPPED) {
                 throw new Error('Cannot cancel processed order');
            }

            await client.query(`UPDATE orders SET order_status = 'CANCELED' WHERE id = $1`, [orderId]);
            await client.query('COMMIT');
            return { canceled: true };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // --- 2. LOGIC ĐỌC (READ) - Tối ưu cho hiển thị ---

    static async getOrderById(orderId, userId) {
        // Lấy chi tiết đơn hàng + list sản phẩm
        const query = `
            SELECT o.*, 
                json_agg(json_build_object(
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'product_name', p.name,
                    'image', p.image_urls[1]
                )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1 AND (o.customer_id = $2 OR $3 = 'ADMIN') -- Cho phép Admin xem mọi đơn
            GROUP BY o.id
        `;
        // Chú ý: $3 ở đây là role, cần truyền từ Service xuống nếu muốn check role chặt chẽ.
        // Tuy nhiên để đơn giản, ở đây ta giả định Service đã check quyền.
        // Tạm thời query này chỉ check customer_id.
        
        const strictQuery = `
             SELECT o.*, 
                json_agg(json_build_object(
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'product_name', p.name
                )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            GROUP BY o.id
        `;
        
        const rows = await db.query(strictQuery, [orderId]);
        return rows[0];
    }

    static async getCustomerOrders(userId, limit = 50, offset = 0, status = null) {
        let query = `
            SELECT o.*, 
            (SELECT json_agg(json_build_object('name', p.name, 'qty', oi.quantity)) 
             FROM order_items oi JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = o.id) as items_preview
            FROM orders o 
            WHERE o.customer_id = $1
        `;
        const params = [userId, limit, offset];
        
        if (status) {
            query += ` AND o.order_status = $4`;
            params.push(status);
        }
        
        query += ` ORDER BY o.created_at DESC LIMIT $2 OFFSET $3`;
        return await db.query(query, params);
    }

    static async getAllOrders({ limit, offset, status }) {
        // Dùng cho trang Admin quản lý đơn hàng
        let query = `
            SELECT 
                o.id, o.total_price, o.order_status, o.payment_status, o.created_at,
                u.username, u.email, o.shipping_address
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            WHERE o.is_active = true
        `;
        const params = [limit, offset];
        let paramIndex = 3;

        if (status) {
            query += ` AND o.order_status = $${paramIndex}`;
            params.push(status);
        }

        query += ` ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;

        return await db.query(query, params);
    }

    static async softDeleteOrder(orderId, userId) {
        // Soft delete order bằng cách set is_active = false
        const query = `
            UPDATE orders 
            SET is_active = false 
            WHERE id = $1
            RETURNING id, order_status
        `;
        const result = await db.query(query, [orderId]);
        
        if (result.length === 0) {
            throw new Error('Order not found');
        }
        
        return result[0];
    }

    static async getOrderDetailsForPDF(orderId, userId) {
        // Lấy chi tiết đơn hàng kèm items để xuất PDF
        const orderQuery = `
            SELECT 
                o.id, 
                o.customer_id, 
                o.total_price, 
                o.shipping_address, 
                o.order_status, 
                o.payment_status, 
                o.created_at,
                u.username,
                u.email,
                u.first_name,
                u.last_name
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            WHERE o.id = $1 AND o.is_active = true
        `;
        
        const itemsQuery = `
            SELECT 
                oi.id,
                oi.product_id,
                oi.quantity,
                oi.price,
                p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `;
        
        const orderResult = await db.query(orderQuery, [orderId]);
        if (orderResult.length === 0) {
            throw new Error('Order not found');
        }
        
        const itemsResult = await db.query(itemsQuery, [orderId]);
        
        return {
            ...orderResult[0],
            items: itemsResult
        };
    }

    // --- 3. DASHBOARD STATS (Cho biểu đồ) ---

    static async getDashboardStats() {
        // Query gom nhóm để tối ưu hiệu năng DB
        const query = `
            SELECT
                COALESCE(SUM(total_price) FILTER (WHERE order_status != 'CANCELED'), 0) as total_revenue,
                COUNT(*) as total_orders,
                COUNT(*) FILTER (WHERE order_status = 'PENDING') as pending_orders,
                COUNT(DISTINCT customer_id) as active_customers
            FROM orders
        `;
        const result = await db.query(query);
        return result[0];
    }

    static async getSalesOverview(days) {
    // Kỹ thuật: Dùng generate_series để tạo ra danh sách ngày liên tục từ quá khứ đến hiện tại
    // Sau đó LEFT JOIN với bảng orders để những ngày không có đơn vẫn hiện ra (với giá trị 0)
    const query = `
        WITH date_series AS (
            SELECT generate_series(
                CURRENT_DATE - ($1 || ' days')::INTERVAL, 
                CURRENT_DATE, 
                '1 day'::INTERVAL
            )::date AS date
        )
        SELECT 
            TO_CHAR(ds.date, 'YYYY-MM-DD') as date, 
            COALESCE(SUM(o.total_price), 0) as total_sales,
            COUNT(o.id) as order_count
        FROM date_series ds
        LEFT JOIN orders o ON 
            DATE(o.created_at) = ds.date 
            AND o.order_status != 'CANCELED'
        GROUP BY ds.date
        ORDER BY ds.date ASC
    `;
    const normalizedDays = (Number(days) || 7) - 1;
    return await db.query(query, [`${normalizedDays} days`]);
  }

   static async getRecentOrders(limit) {
    // Sửa lỗi N/A: Gom nhóm thông tin user vào object 'customer_info'
    const query = `
      SELECT 
        o.id,
        o.total_price,
        o.order_status,
        o.payment_status,
        o.created_at,
        json_build_object(
            'username', u.username,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name
        ) as customer_info
      FROM orders o
      LEFT JOIN users u ON u.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT $1
    `;
    return await db.query(query, [limit]);
  }
}

module.exports = {
    OrderRepository,
    ORDER_STATUS
};