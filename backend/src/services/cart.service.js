const CartRepository = require('../repositories/cart.repository');

class CartService {
    /**
     * Get cart items for user with validation
     */
    static async getCart(userId) {
        try {
            // Validate userId
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            const cartItems = await CartRepository.findCartItems(userId);
            
            return {
                cart_items: cartItems
            };
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    /**
     * Add product to cart with validation
     */
    static async addProduct(userId, productId, quantity) {
        try {
            // Validate inputs
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            if (!productId || !Number.isInteger(productId) || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Quantity must be a positive integer');
            }

            if (quantity > 100) {
                throw new Error('Cannot add more than 100 items at once');
            }

            // Check product stock availability
            await CartRepository.checkProductStock(productId, quantity);

            // Get or create cart
            const cartId = await CartRepository.getOrCreateCart(userId);

            // Add or update item
            await CartRepository.addOrUpdateItem(cartId, productId, quantity);

            return { message: 'Product added to cart successfully' };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update cart item quantity with validation
     */
    static async updateCartItem(userId, productId, quantity) {
        try {
            // Validate inputs
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            if (!productId || !Number.isInteger(productId) || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Quantity must be a positive integer');
            }

            if (quantity > 100) {
                throw new Error('Cannot have more than 100 items of same product');
            }

            // Check product stock availability
            await CartRepository.checkProductStock(productId, quantity);

            // Get cart
            const cartId = await CartRepository.getOrCreateCart(userId);

            // Update item
            await CartRepository.updateItemQuantity(cartId, productId, quantity);

            return { message: 'Cart item updated successfully' };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove product from cart with validation
     */
    static async removeProduct(userId, productId) {
        try {
            // Validate inputs
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            if (!productId || !Number.isInteger(productId) || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            // Get cart
            const cartId = await CartRepository.getOrCreateCart(userId);

            // Remove item
            await CartRepository.removeItem(cartId, productId);

            return { message: 'Product removed from cart successfully' };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clear all items from user's cart
     */
    static async clearCart(userId) {
        try {
            // Validate userId
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            const cartId = await CartRepository.getOrCreateCart(userId);
            await CartRepository.clearCart(cartId);

            return { message: 'Cart cleared successfully' };
        } catch (error) {
            throw new Error('Error clearing cart: ' + error.message);
        }
    }

    /**
     * Get cart summary (item count, total)
     */
    static async getCartSummary(userId) {
        try {
            // Validate userId
            if (!userId || !Number.isInteger(userId) || userId <= 0) {
                throw new Error('Invalid user ID');
            }

            const cartId = await CartRepository.getOrCreateCart(userId);
            const counts = await CartRepository.getCartItemCount(userId);
            const total = await CartRepository.getCartTotal(cartId);

            return {
                itemCount: counts.itemCount,
                totalQuantity: counts.totalQuantity,
                total: total
            };
        } catch (error) {
            throw new Error('Error fetching cart summary: ' + error.message);
        }
    }
}

module.exports = CartService;