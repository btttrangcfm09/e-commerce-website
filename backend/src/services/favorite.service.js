const FavoriteRepository = require('../repositories/favorite.repository');

class FavoriteService {
  static async addToFavorites(userId, productId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const result = await FavoriteRepository.addToFavorites(userId, productId);
    return {
      success: true,
      message: 'Product added to favorites',
      favorite: result
    };
  }

  static async removeFromFavorites(userId, productId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const result = await FavoriteRepository.removeFromFavorites(userId, productId);
    if (!result) {
      throw new Error('Favorite not found');
    }

    return {
      success: true,
      message: 'Product removed from favorites'
    };
  }

  static async toggleFavorite(userId, productId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const isFavorite = await FavoriteRepository.isFavorite(userId, productId);
      
      if (isFavorite) {
        await FavoriteRepository.removeFromFavorites(userId, productId);
        return {
          success: true,
          isFavorite: false,
          message: 'Product removed from favorites'
        };
      } else {
        await FavoriteRepository.addToFavorites(userId, productId);
        return {
          success: true,
          isFavorite: true,
          message: 'Product added to favorites'
        };
      }
    } catch (error) {
      console.error('FavoriteService toggleFavorite error:', error);
      throw error;
    }
  }

  static async getUserFavorites(userId, limit = 50, offset = 0) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const favorites = await FavoriteRepository.getUserFavorites(userId, limit, offset);
    const count = await FavoriteRepository.getFavoritesCount(userId);

    return {
      success: true,
      data: favorites,
      total: count
    };
  }

  static async isFavorite(userId, productId) {
    if (!userId || !productId) {
      return false;
    }

    return await FavoriteRepository.isFavorite(userId, productId);
  }

  static async checkMultipleFavorites(userId, productIds) {
    if (!userId || !productIds || productIds.length === 0) {
      return {};
    }

    return await FavoriteRepository.checkMultipleFavorites(userId, productIds);
  }
}

module.exports = FavoriteService;
