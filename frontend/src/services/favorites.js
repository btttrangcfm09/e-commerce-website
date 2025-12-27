import axiosInstance from './api';

const FavoritesService = {
  // Get all favorites
  async getFavorites(params = {}) {
    const { limit = 50, offset = 0 } = params;
    const res = await axiosInstance.get('/client/favorites', {
      params: { limit, offset },
    });
    return res?.data;
  },

  // Toggle favorite (add or remove)
  async toggleFavorite(productId) {
    const res = await axiosInstance.post('/client/favorites/toggle', {
      productId,
    });
    return res?.data;
  },

  // Check if product is favorite
  async checkFavorite(productId) {
    const res = await axiosInstance.get(`/client/favorites/check/${productId}`);
    return res?.data;
  },

  // Check multiple products
  async checkMultipleFavorites(productIds) {
    const res = await axiosInstance.post('/client/favorites/check-multiple', {
      productIds,
    });
    return res?.data;
  },

  // Remove from favorites
  async removeFavorite(productId) {
    const res = await axiosInstance.delete(`/client/favorites/${productId}`);
    return res?.data;
  },
};

export default FavoritesService;
