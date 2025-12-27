import axiosInstance from './api';

/**
 * Recommendation API Service
 * Purpose: Handle all recommendation-related API calls
 */
const recommendationService = {
    /**
     * Track product view
     */
    trackProductView: (productId, sessionId = null) => 
        axiosInstance.post('/recommendations/track-view', { productId, sessionId }),

    /**
     * Get similar products for "Customers Also Liked"
     */
    getSimilarProducts: (productId, limit = 8) => 
        axiosInstance.get(`/recommendations/similar/${productId}`, { params: { limit } }),

    /**
     * Get frequently bought together products
     */
    getFrequentlyBoughtTogether: (productId, limit = 4) => 
        axiosInstance.get(`/recommendations/bought-together/${productId}`, { params: { limit } }),

    /**
     * Get personalized recommendations (requires auth)
     */
    getPersonalizedRecommendations: (limit = 8, excludeIds = []) => 
        axiosInstance.get('/recommendations/personalized', { 
            params: { 
                limit,
                exclude: excludeIds.join(',')
            } 
        }),

    /**
     * Get recommendations from purchase history (requires auth)
     */
    getRecommendationsFromPurchaseHistory: (limit = 8) => 
        axiosInstance.get('/recommendations/from-purchases', { params: { limit } }),

    /**
     * Get trending products in category
     */
    getTrendingInCategory: (categoryId, excludeProductId = null, limit = 8) => 
        axiosInstance.get(`/recommendations/trending/${categoryId}`, { 
            params: { 
                limit,
                exclude: excludeProductId 
            } 
        }),

    /**
     * Get recently viewed products (requires auth)
     */
    getRecentlyViewed: (limit = 10) => 
        axiosInstance.get('/recommendations/recently-viewed', { params: { limit } }),

    /**
     * Get comprehensive product page recommendations
     * THIS IS THE MAIN ENDPOINT FOR PRODUCT DETAIL PAGES
     */
    getProductPageRecommendations: (productId, limit = 8) => 
        axiosInstance.get(`/recommendations/product/${productId}`, { params: { limit } }),

    /**
     * Get homepage recommendations
     */
    getHomepageRecommendations: (limit = 12) => 
        axiosInstance.get('/recommendations/homepage', { params: { limit } }),
};

export default recommendationService;
