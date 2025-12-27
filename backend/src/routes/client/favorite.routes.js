const express = require('express');
const FavoriteController = require('../../controllers/client/favorite.controller');
const authenticate = require('../../middleware/auth/authenticate');
const router = express.Router();

// Get user's favorites
router.get('/', authenticate, FavoriteController.getFavorites);

// Toggle favorite (add or remove)
router.post('/toggle', authenticate, FavoriteController.toggleFavorite);

// Check if product is favorite
router.get('/check/:productId', authenticate, FavoriteController.checkFavorite);

// Check multiple products favorite status
router.post('/check-multiple', authenticate, FavoriteController.checkMultipleFavorites);

// Remove from favorites
router.delete('/:productId', authenticate, FavoriteController.removeFavorite);

module.exports = router;
