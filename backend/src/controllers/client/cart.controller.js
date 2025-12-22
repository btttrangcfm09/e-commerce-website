const CartService = require('../../services/cart.service');

class CartController {
  // Lấy danh sách sản phẩm trong giỏ hàng
  static async getCart(req, res) {
    try {
      const userId = req.user.userId;
      const cart = await CartService.getCart(userId);
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
      
      // Parse to integers
      const parsedProductId = parseInt(productId);
      const parsedQuantity = parseInt(quantity);
      
      const result = await CartService.addProduct(userId, parsedProductId, parsedQuantity);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.userId;
      
      // Parse to integers
      const parsedProductId = parseInt(productId);
      const parsedQuantity = parseInt(quantity);
      
      const result = await CartService.updateCartItem(userId, parsedProductId, parsedQuantity);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeProduct(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.userId;
      
      // Parse to integer
      const parsedProductId = parseInt(productId);
      
      const result = await CartService.removeProduct(userId, parsedProductId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = CartController;