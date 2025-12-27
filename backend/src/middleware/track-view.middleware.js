const RecommendationRepository = require('../repositories/recommendation.repository');

/**
 * Track Product View Middleware
 * Purpose: Automatically track when users view products
 * 
 * This middleware can be attached to product detail routes to automatically
 * log product views for recommendation purposes.
 * 
 * Usage:
 * router.get('/products/:id', trackProductView, productController.getById);
 */
const trackProductView = async (req, res, next) => {
    try {
        // Try to get product ID from various sources
        const productId = req.params.id || req.params.productId || req.query.id;
        
        if (!productId) {
            // No product ID found, skip tracking
            return next();
        }

        // Get user ID if authenticated (from auth middleware)
        const userId = req.user?.id || null;

        // Get or create session ID for guest users
        let sessionId = req.cookies?.sessionId;
        
        if (!userId && !sessionId) {
            // Create new session for guest
            sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Set session cookie (optional, for persistent guest tracking)
            res.cookie('sessionId', sessionId, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true,
                sameSite: 'lax'
            });
        }

        // Track the view asynchronously (don't wait for it to complete)
        RecommendationRepository.trackProductView(userId, parseInt(productId), sessionId)
            .catch(error => {
                console.error('Failed to track product view:', error);
                // Don't throw - tracking failure shouldn't break the request
            });

        // Continue to next middleware/controller
        next();

    } catch (error) {
        console.error('Error in trackProductView middleware:', error);
        // Don't block the request if tracking fails
        next();
    }
};

module.exports = { trackProductView };
