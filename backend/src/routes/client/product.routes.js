const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

router.get('/best-selling', productController.getBestSelling);
router.get('/', productController.getProducts);

module.exports = router;