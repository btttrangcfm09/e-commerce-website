const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

// Lấy danh sách toàn bộ sản phẩm với tùy chọn tìm kiếm
router.get('/', productController.getProducts);

module.exports = router;