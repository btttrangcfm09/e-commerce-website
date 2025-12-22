const db = require('../config/database');
const crypto = require('crypto');

class CartRepository {
    /**
     * Get cart items for a user
     */
    static async findCartItems(userId) {
        const query = `
            SELECT 
                ci.id as cart_item_id,
                ci.cart_id,
                ci.product_id,
                p.name as product_name,
                p.price as unit_price,
                ci.quantity,
                (p.price * ci.quantity) as total_price,
                p.stock,
                p.image_urls,
                ci.created_at
            FROM cart_items ci
            INNER JOIN carts c ON ci.cart_id = c.id
            INNER JOIN products p ON ci.product_id = p.id
            WHERE c.customer_id = $1 AND p.is_active = true
            ORDER BY ci.created_at DESC
        `;

        try {
            const result = await db.query(query, [userId]);
            return result;
        } catch (error) {
            throw new Error('Failed to fetch cart items: ' + error.message);
        }
    }

    /**
     * Get or create cart for user
     */
    static async getOrCreateCart(userId) {
        // First try to get existing cart
        let cartQuery = 'SELECT id FROM carts WHERE customer_id = $1';
        
        try {
            let result = await db.query(cartQuery, [userId]);
            
            if (result.length > 0) {
                return result[0].id;
            }

            // Create new cart if doesn't exist
            const createQuery = 'INSERT INTO carts (customer_id) VALUES ($1) RETURNING id';
            result = await db.query(createQuery, [userId]);
            return result[0].id;
        } catch (error) {
            throw new Error('Failed to get or create cart: ' + error.message);
        }
    }

    /**
     * Check if product exists in cart
     */
    static async findCartItem(cartId, productId) {
        const query = `
            SELECT id, quantity 
            FROM cart_items 
            WHERE cart_id = $1 AND product_id = $2
        `;

        try {
            const result = await db.query(query, [cartId, productId]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            throw new Error('Failed to find cart item: ' + error.message);
        }
    }

    /**
     * Add product to cart or update quantity if exists
     */
    static async addOrUpdateItem(cartId, productId, quantity) {
        // Check if item already exists
        const existingItem = await this.findCartItem(cartId, productId);

        try {
            if (existingItem) {
                // Update quantity
                const updateQuery = `
                    UPDATE cart_items 
                    SET quantity = quantity + $3 
                    WHERE cart_id = $1 AND product_id = $2
                    RETURNING id, quantity
                `;
                const result = await db.query(updateQuery, [cartId, productId, quantity]);
                return result[0];
            } else {
                // Insert new item - generate ID
                const itemId = crypto.randomBytes(12).toString('hex'); // 24 characters
                const insertQuery = `
                    INSERT INTO cart_items (id, cart_id, product_id, quantity)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, quantity
                `;
                const result = await db.query(insertQuery, [itemId, cartId, productId, quantity]);
                return result[0];
            }
        } catch (error) {
            throw new Error('Failed to add or update cart item: ' + error.message);
        }
    }

    /**
     * Update cart item quantity
     */
    static async updateItemQuantity(cartId, productId, quantity) {
        const query = `
            UPDATE cart_items 
            SET quantity = $3 
            WHERE cart_id = $1 AND product_id = $2
            RETURNING id, quantity
        `;

        try {
            const result = await db.query(query, [cartId, productId, quantity]);
            
            if (result.length === 0) {
                throw new Error('Cart item not found');
            }
            
            return result[0];
        } catch (error) {
            throw new Error('Failed to update cart item: ' + error.message);
        }
    }

    /**
     * Remove product from cart
     */
    static async removeItem(cartId, productId) {
        const query = `
            DELETE FROM cart_items 
            WHERE cart_id = $1 AND product_id = $2
            RETURNING id
        `;

        try {
            const result = await db.query(query, [cartId, productId]);
            
            if (result.length === 0) {
                throw new Error('Cart item not found');
            }
            
            return result[0];
        } catch (error) {
            throw new Error('Failed to remove cart item: ' + error.message);
        }
    }

    /**
     * Clear all items from cart
     */
    static async clearCart(cartId) {
        const query = 'DELETE FROM cart_items WHERE cart_id = $1';

        try {
            await db.query(query, [cartId]);
            return true;
        } catch (error) {
            throw new Error('Failed to clear cart: ' + error.message);
        }
    }

    /**
     * Check if product is available in stock
     */
    static async checkProductStock(productId, requestedQuantity) {
        const query = `
            SELECT stock, is_active 
            FROM products 
            WHERE id = $1
        `;

        try {
            const result = await db.query(query, [productId]);
            
            if (result.length === 0) {
                throw new Error('Product not found');
            }

            const product = result[0];
            
            if (!product.is_active) {
                throw new Error('Product is not available');
            }

            if (product.stock < requestedQuantity) {
                throw new Error(`Only ${product.stock} items available in stock`);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get total cart value
     */
    static async getCartTotal(cartId) {
        const query = `
            SELECT 
                SUM(p.price * ci.quantity) as total
            FROM cart_items ci
            INNER JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1 AND p.is_active = true
        `;

        try {
            const result = await db.query(query, [cartId]);
            return parseFloat(result[0]?.total || 0);
        } catch (error) {
            throw new Error('Failed to calculate cart total: ' + error.message);
        }
    }

    /**
     * Get cart item count
     */
    static async getCartItemCount(userId) {
        const query = `
            SELECT 
                COUNT(*) as item_count,
                SUM(ci.quantity) as total_quantity
            FROM cart_items ci
            INNER JOIN carts c ON ci.cart_id = c.id
            WHERE c.customer_id = $1
        `;

        try {
            const result = await db.query(query, [userId]);
            return {
                itemCount: parseInt(result[0]?.item_count || 0),
                totalQuantity: parseInt(result[0]?.total_quantity || 0)
            };
        } catch (error) {
            throw new Error('Failed to get cart count: ' + error.message);
        }
    }
}

module.exports = CartRepository;
