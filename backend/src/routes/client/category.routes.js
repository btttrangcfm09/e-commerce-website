const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/client/category.controller');

// Lấy tất cả danh mục
router.get('/', categoryController.getAllCategories);

// Lấy danh mục theo ID
router.get('/:id', categoryController.getCategoryById);

// Tính số lượng danh mục con
router.get('/:id/subcategories/count', categoryController.countSubcategories);

// Tạo slug từ tên danh mục
router.post('/slug', categoryController.generateSlug);

// Lấy đường dẫn đầy đủ của danh mục
router.get('/:id/path', categoryController.getCategoryPath);

module.exports = router;