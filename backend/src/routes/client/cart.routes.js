const express = require('express');
const CartController = require('../../controllers/client/cart.controller');
const authenticate = require('../../middleware/auth/authenticate');
const router = express.Router();

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/info',authenticate, CartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post('/add',authenticate, CartController.addProduct);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update',authenticate, CartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove',authenticate, CartController.removeProduct);

module.exports = router;