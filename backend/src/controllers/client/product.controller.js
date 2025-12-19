const Product = require('../../models/Product');

class productController {
    static async getProducts(req, res) {        
        try {
            const result = await Product.get(req);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({error: err.message });
        }
    }
}

module.exports = productController;