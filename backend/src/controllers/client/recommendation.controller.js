const RecommendationService = require('../../services/recommendation.service');

/**
 * Recommendation Controller
 * Purpose: Handle HTTP requests for product recommendations
 */
class RecommendationController {
    
    /**
     * POST /api/recommendations/track-view
     * Track when a user views a product
     * Body: { productId: number, sessionId?: string }
     */
    static async trackProductView(req, res) {
        try {
            const { productId, sessionId } = req.body;
            const userId = req.user?.id || null;  // From auth middleware if logged in

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
            }

            const result = await RecommendationService.trackProductView(
                productId,
                userId,
                sessionId
            );

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in trackProductView controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to track product view',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/similar/:productId
     * Get similar products for "Customers Also Liked"
     */
    static async getSimilarProducts(req, res) {
        try {
            const { productId } = req.params;
            const limit = parseInt(req.query.limit) || 8;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
            }

            const result = await RecommendationService.getSimilarProducts(productId, limit);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getSimilarProducts controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get similar products',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/bought-together/:productId
     * Get frequently bought together products
     */
    static async getFrequentlyBoughtTogether(req, res) {
        try {
            const { productId } = req.params;
            const limit = parseInt(req.query.limit) || 4;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
            }

            const result = await RecommendationService.getFrequentlyBoughtTogether(productId, limit);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getFrequentlyBoughtTogether controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get frequently bought together products',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/personalized
     * Get personalized recommendations (requires auth)
     */
    static async getPersonalizedRecommendations(req, res) {
        try {
            const userId = req.user?.id;
            const limit = parseInt(req.query.limit) || 8;
            const excludeIds = req.query.exclude ? req.query.exclude.split(',').map(Number) : [];

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required for personalized recommendations'
                });
            }

            const result = await RecommendationService.getPersonalizedRecommendations(
                userId,
                limit,
                excludeIds
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getPersonalizedRecommendations controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get personalized recommendations',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/from-purchases
     * Get recommendations based on purchase history (requires auth)
     */
    static async getRecommendationsFromPurchaseHistory(req, res) {
        try {
            const userId = req.user?.id;
            const limit = parseInt(req.query.limit) || 8;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const result = await RecommendationService.getRecommendationsFromPurchaseHistory(
                userId,
                limit
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getRecommendationsFromPurchaseHistory controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get purchase-based recommendations',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/trending/:categoryId
     * Get trending products in category
     */
    static async getTrendingInCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const excludeProductId = req.query.exclude || null;
            const limit = parseInt(req.query.limit) || 8;

            if (!categoryId) {
                return res.status(400).json({
                    success: false,
                    message: 'Category ID is required'
                });
            }

            const result = await RecommendationService.getTrendingInCategory(
                categoryId,
                excludeProductId,
                limit
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getTrendingInCategory controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get trending products',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/recently-viewed
     * Get user's recently viewed products (requires auth)
     */
    static async getRecentlyViewed(req, res) {
        try {
            const userId = req.user?.id;
            const limit = parseInt(req.query.limit) || 10;

            const result = await RecommendationService.getRecentlyViewed(userId, limit);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getRecentlyViewed controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get recently viewed products',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/product/:productId
     * Get comprehensive recommendations for product page
     * This combines multiple strategies automatically
     */
    static async getProductPageRecommendations(req, res) {
        try {
            const { productId } = req.params;
            const userId = req.user?.id || null;
            const limit = parseInt(req.query.limit) || 8;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
            }

            const result = await RecommendationService.getProductPageRecommendations(
                productId,
                userId,
                limit
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getProductPageRecommendations controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get product recommendations',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/homepage
     * Get recommendations for homepage
     */
    static async getHomepageRecommendations(req, res) {
        try {
            const userId = req.user?.id || null;
            const limit = parseInt(req.query.limit) || 12;

            const result = await RecommendationService.getHomepageRecommendations(userId, limit);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getHomepageRecommendations controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get homepage recommendations',
                error: error.message
            });
        }
    }
}

module.exports = RecommendationController;
