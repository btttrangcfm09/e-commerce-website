const db = require('../config/database');

class Cart {
  constructor(data) {
    this.id = data.id;
    this.userId = data.customer_id || data.userId;
    this.createdAt = data.created_at || data.createdAt;
    this.items = data.items || [];
  }

  // Thêm sản phẩm vào giỏ hàng
  static async addProductToCart(userId, productId, quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    try {
      const query = `
        CALL public.add_product_to_cart($1, $2, $3);
      `;
      await db.query(query, [userId, productId, quantity]);
    } catch (err) {
      throw new Error(err.message); // Sử dụng lỗi từ procedure
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCartItemQuantity(userId, productId, quantity) {
    try {
      const query = `
        CALL public.update_cart_item_quantity($1, $2, $3);
      `;
      
      const result = await db.query(query, [userId, productId, quantity]);
      
      if (result.rowCount === 0) {
        throw new Error('No rows affected. Please check the input data or procedure.');
      }
  
    } catch (err) {
      throw new Error(err.message);
    }
  }
  

  // Lấy danh sách sản phẩm trong giỏ hàng
  static async getCartItems(userId) {
    try {
      const query = `select * from get_cart_contents($1)`;
      const result = await db.query(query, [userId]);
      return { cart_items: result};
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeProductFromCart(userId, productId) {
    try {
      const query = `select remove_from_cart($1, $2);`;
      
      await db.query(query, [userId, productId]);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
}

module.exports = Cart;