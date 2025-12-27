const { pool } = require('../config/database');

class FavoriteRepository {
  // Add product to favorites
  static async addToFavorites(userId, productId) {
    try {
      const query = `
        INSERT INTO favorites (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING
        RETURNING *
      `;
      const result = await pool.query(query, [userId, productId]);
      // If conflict (already exists), rows will be empty, so return a success object
      if (result.rows.length === 0) {
        // Product already in favorites, return existing record
        const existingQuery = `
          SELECT * FROM favorites
          WHERE user_id = $1 AND product_id = $2
        `;
        const existing = await pool.query(existingQuery, [userId, productId]);
        return existing.rows[0];
      }
      return result.rows[0];
    } catch (error) {
      if (error.code === '42P01') {
        throw new Error('Favorites table does not exist. Please run the database migration to create the favorites table.');
      }
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove product from favorites
  static async removeFromFavorites(userId, productId) {
    try {
      const query = `
        DELETE FROM favorites
        WHERE user_id = $1 AND product_id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [userId, productId]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '42P01') {
        throw new Error('Favorites table does not exist. Please run the database migration.');
      }
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  // Check if product is in favorites
  static async isFavorite(userId, productId) {
    try {
      const query = `
        SELECT EXISTS(
          SELECT 1 FROM favorites
          WHERE user_id = $1 AND product_id = $2
        ) as is_favorite
      `;
      const result = await pool.query(query, [userId, productId]);
      return result.rows[0].is_favorite;
    } catch (error) {
      if (error.code === '42P01') {
        // Table doesn't exist, return false
        return false;
      }
      console.error('Error checking favorite:', error);
      throw error;
    }
  }

  // Get all favorites for a user with product details
  static async getUserFavorites(userId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        f.id,
        f.user_id,
        f.product_id,
        f.created_at,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.stock as product_stock,
        p.image_urls as product_image_urls,
        p.category_id,
        p.is_active,
        c.name as category_name
      FROM favorites f
      INNER JOIN products p ON f.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE f.user_id = $1 AND p.is_active = true
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // Get favorites count for a user
  static async getFavoritesCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM favorites f
      INNER JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1 AND p.is_active = true
    `;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count, 10);
  }

  // Get multiple favorites status for products
  static async checkMultipleFavorites(userId, productIds) {
    const query = `
      SELECT product_id
      FROM favorites
      WHERE user_id = $1 AND product_id = ANY($2)
    `;
    const result = await pool.query(query, [userId, productIds]);
    const favoriteIds = result.rows.map(row => row.product_id);
    
    return productIds.reduce((acc, id) => {
      acc[id] = favoriteIds.includes(id);
      return acc;
    }, {});
  }
}

module.exports = FavoriteRepository;
