const Cart = require('../../models/Cart');
class CartController {
  // Lấy danh sách sản phẩm trong giỏ hàng
  static async getCart(req, res) {
    try {
      const customerId = req.user.userId;
      const cart = await Cart.getCartItems(customerId);
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  static async addProduct(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, quantity } = req.body;
      await Cart.addProductToCart(userId, productId, quantity);
      res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCartItem(req, res) {
    try {
      const {  productId, quantity } = req.body;
      const userId = req.user.userId;
      await Cart.updateCartItemQuantity( userId,productId, quantity);
      res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeProduct(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.userId;      
      await Cart.removeProductFromCart( userId,productId);
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = CartController;