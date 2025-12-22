const Product = require('../../models/Product');
const ProductService = require('../../services/product.service');

class productController {
    static async getProducts(req, res) {        
        try {
            const result = await Product.get(req);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({error: err.message });
        }
    }

    static async getBestSelling(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const products = await ProductService.getBestSellingProducts(limit);
            res.status(200).json({ products });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = productController;