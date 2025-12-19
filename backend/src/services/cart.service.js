const Cart = require('../models/Cart');
class CartService {
    static async getCart(userId) {
        return await Cart.getCartItems(userId);
    }

    static async addProduct(userId, productId, quantity) {
        return await Cart.addProductToCart(userId, productId, quantity);
    }

    static async updateCartItem(cartId, productId, quantity) {
        return await Cart.updateCartItemQuantity(cartId, productId, quantity);
    }

    static async removeProduct(cartId, productId) {
        return await Cart.removeProductFromCart(cartId, productId);
    }
}

module.exports = CartService;