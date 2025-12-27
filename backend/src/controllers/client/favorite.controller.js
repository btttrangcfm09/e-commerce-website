const FavoriteService = require('../../services/favorite.service');

class FavoriteController {
  // Get user's favorites
  static async getFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50, offset = 0 } = req.query;

      const result = await FavoriteService.getUserFavorites(
        userId,
        Number(limit),
        Number(offset)
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get favorites'
      });
    }
  }

  // Toggle favorite (add or remove)
  static async toggleFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const result = await FavoriteService.toggleFavorite(userId, productId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to toggle favorite',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Check if product is favorite
  static async checkFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { productId } = req.params;

      const isFavorite = await FavoriteService.isFavorite(userId, productId);
      return res.status(200).json({
        success: true,
        isFavorite
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check favorite status'
      });
    }
  }

  // Check multiple products favorite status
  static async checkMultipleFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { productIds } = req.body;

      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs array is required'
        });
      }

      const favorites = await FavoriteService.checkMultipleFavorites(userId, productIds);
      return res.status(200).json({
        success: true,
        favorites
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check favorites'
      });
    }
  }

  // Remove from favorites
  static async removeFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { productId } = req.params;

      const result = await FavoriteService.removeFromFavorites(userId, productId);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message === 'Favorite not found' ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to remove favorite'
      });
    }
  }
}

module.exports = FavoriteController;
