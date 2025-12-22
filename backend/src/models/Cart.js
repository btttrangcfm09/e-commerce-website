const CartRepository = require('../repositories/cart.repository');

/**
 * Cart Model - Thin wrapper around repository
 * Business logic is handled by CartService
 */
class Cart {
  constructor(data) {
    this.id = data.id;
    this.userId = data.customer_id || data.userId;
    this.createdAt = data.created_at || data.createdAt;
    this.items = data.items || [];
  }

  /**
   * Validate cart data
   */
  static validate(data) {
    const errors = [];

    if (!data.userId || !Number.isInteger(data.userId) || data.userId <= 0) {
      errors.push('Valid user ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Cart;