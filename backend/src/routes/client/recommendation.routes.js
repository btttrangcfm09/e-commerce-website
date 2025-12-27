const express = require('express');
const router = express.Router();
const RecommendationController = require('../../controllers/client/recommendation.controller');
const { optionalAuth } = require('../../middleware/auth/optional-auth.middleware');

/**
 * Recommendation Routes
 * Base path: /api/recommendations
 * 
 * These routes provide various product recommendation strategies
 */

// Track product view (can be called without auth for guest users)
router.post('/track-view', optionalAuth, RecommendationController.trackProductView);

// Get similar products (no auth required)
router.get('/similar/:productId', RecommendationController.getSimilarProducts);

// Get frequently bought together (no auth required)
router.get('/bought-together/:productId', RecommendationController.getFrequentlyBoughtTogether);

// Get personalized recommendations (requires auth)
router.get('/personalized', optionalAuth, RecommendationController.getPersonalizedRecommendations);

// Get recommendations from purchase history (requires auth)
router.get('/from-purchases', optionalAuth, RecommendationController.getRecommendationsFromPurchaseHistory);

// Get trending products in category (no auth required)
router.get('/trending/:categoryId', RecommendationController.getTrendingInCategory);

// Get recently viewed products (requires auth)
router.get('/recently-viewed', optionalAuth, RecommendationController.getRecentlyViewed);

// Get comprehensive product page recommendations (auth optional)
// THIS IS THE MAIN ENDPOINT FOR PRODUCT DETAIL PAGES
router.get('/product/:productId', optionalAuth, RecommendationController.getProductPageRecommendations);

// Get homepage recommendations (auth optional)
router.get('/homepage', optionalAuth, RecommendationController.getHomepageRecommendations);

module.exports = router;
