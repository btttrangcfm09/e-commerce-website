const RecommendationRepository = require('../repositories/recommendation.repository');

/**
 * Recommendation Service
 * Purpose: Business logic layer for product recommendations
 * Handles data formatting and coordination between repository and controllers
 */
class RecommendationService {
    
    /**
     * Track product view (with optional user authentication)
     */
    static async trackProductView(productId, userId = null, sessionId = null) {
        try {
            // Validate inputs
            if (!productId) {
                throw new Error('Product ID is required');
            }

            // If no userId and no sessionId, create a temporary session
            if (!userId && !sessionId) {
                sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }

            await RecommendationRepository.trackProductView(userId, productId, sessionId);
            
            return {
                success: true,
                message: 'Product view tracked successfully'
            };
        } catch (error) {
            console.error('Error in trackProductView service:', error);
            throw error;
        }
    }

    /**
     * Get similar products for "Customers Also Liked" section
     */
    static async getSimilarProducts(productId, limit = 8) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            const products = await RecommendationRepository.getSimilarProducts(
                parseInt(productId), 
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'similar'
            };
        } catch (error) {
            console.error('Error in getSimilarProducts service:', error);
            throw error;
        }
    }

    /**
     * Get frequently bought together products
     */
    static async getFrequentlyBoughtTogether(productId, limit = 4) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            const products = await RecommendationRepository.getFrequentlyBoughtTogether(
                parseInt(productId), 
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'bought_together'
            };
        } catch (error) {
            console.error('Error in getFrequentlyBoughtTogether service:', error);
            throw error;
        }
    }

    /**
     * Get personalized recommendations for logged-in users
     */
    static async getPersonalizedRecommendations(userId, limit = 8, excludeProductIds = []) {
        try {
            if (!userId) {
                throw new Error('User ID is required for personalized recommendations');
            }

            const products = await RecommendationRepository.getPersonalizedRecommendations(
                userId, 
                limit,
                excludeProductIds
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'personalized',
                message: products.length > 0 
                    ? 'Recommendations based on your viewing history' 
                    : 'No personalized recommendations available yet. Start browsing!'
            };
        } catch (error) {
            console.error('Error in getPersonalizedRecommendations service:', error);
            throw error;
        }
    }

    /**
     * Get recommendations based on purchase history
     */
    static async getRecommendationsFromPurchaseHistory(userId, limit = 8) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const products = await RecommendationRepository.getRecommendationsFromPurchaseHistory(
                userId, 
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'purchase_based',
                message: products.length > 0 
                    ? 'Based on your previous purchases' 
                    : 'No purchase-based recommendations available yet'
            };
        } catch (error) {
            console.error('Error in getRecommendationsFromPurchaseHistory service:', error);
            throw error;
        }
    }

    /**
     * Get trending products in category
     */
    static async getTrendingInCategory(categoryId, excludeProductId = null, limit = 8) {
        try {
            if (!categoryId) {
                throw new Error('Category ID is required');
            }

            const products = await RecommendationRepository.getTrendingInCategory(
                parseInt(categoryId),
                excludeProductId ? parseInt(excludeProductId) : null,
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'trending'
            };
        } catch (error) {
            console.error('Error in getTrendingInCategory service:', error);
            throw error;
        }
    }

    /**
     * Get recently viewed products for user
     */
    static async getRecentlyViewed(userId, limit = 10) {
        try {
            if (!userId) {
                return {
                    success: true,
                    count: 0,
                    products: [],
                    message: 'Login to see your recently viewed products'
                };
            }

            const products = await RecommendationRepository.getRecentlyViewed(userId, limit);

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'recently_viewed'
            };
        } catch (error) {
            console.error('Error in getRecentlyViewed service:', error);
            throw error;
        }
    }

    /**
     * Get comprehensive recommendations for product detail page
     * This is the MAIN function for product pages
     */
    static async getProductPageRecommendations(productId, userId = null, limit = 8) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            const products = await RecommendationRepository.getProductPageRecommendations(
                parseInt(productId),
                userId,
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: 'mixed',
                title: 'Khách hàng cũng thích',  // "Customers Also Liked"
                description: 'Sản phẩm tương tự được người mua khác quan tâm'
            };
        } catch (error) {
            console.error('Error in getProductPageRecommendations service:', error);
            throw error;
        }
    }

    /**
     * Get recommendations for homepage
     */
    static async getHomepageRecommendations(userId = null, limit = 12) {
        try {
            const products = await RecommendationRepository.getHomepageRecommendations(
                userId,
                limit
            );

            return {
                success: true,
                count: products.length,
                products: this._formatProducts(products),
                recommendationType: userId ? 'personalized_homepage' : 'trending_homepage',
                title: userId ? 'Đề xuất cho bạn' : 'Sản phẩm nổi bật',
                description: userId 
                    ? 'Dựa trên sở thích của bạn' 
                    : 'Sản phẩm được nhiều người quan tâm'
            };
        } catch (error) {
            console.error('Error in getHomepageRecommendations service:', error);
            throw error;
        }
    }

    /**
     * Format products to match frontend expected format
     * Ensures consistency across all recommendation types
     */
    static _formatProducts(products) {
        return products.map(product => ({
            product_id: product.id,
            product_name: product.name,
            product_description: product.description,
            product_price: parseFloat(product.price),
            product_stock: product.stock,
            product_image_urls: product.image_urls || [],
            category_id: product.category_id,
            category_name: product.category_name,
            // Additional recommendation metadata
            relevance_score: product.relevance_score || product.similarity_score || product.match_score || 0,
            frequency: product.frequency || null,  // For "bought together"
            trending_score: product.trending_score || null,  // For trending
            viewed_at: product.viewed_at || null  // For recently viewed
        }));
    }
}

module.exports = RecommendationService;
