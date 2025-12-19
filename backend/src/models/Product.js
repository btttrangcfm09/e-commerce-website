const db = require('../config/database');

class Product {
    static async get(req) {
        try {            
            if (req.query.id) {
                const result = await db.query('select * from get_product_details($1)', [req.query.id]);
                return result[0] || null;
            }            

            const result = await db.query('select * from get_products($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
                req.query.search || null,
                req.query.categoryId || null,
                req.query.minPrice || null,
                req.query.maxPrice || null,
                req.query.includeInactive || false,
                req.query.page || 1,
                req.query.pageSize || 10,
                req.query.sortBy || 'id',
                req.query.sortOrder || 'asc',
            ]);
            return {
                products: result,
                pagination: {
                    page: parseInt(req.query.page) || 1,
                    pageSize: parseInt(req.query.pageSize) || 10,
                    total: result[0]?.total_count || 0,
                    totalPages: Math.ceil((result[0]?.total_count || 0) / (req.query.pageSize || 10)),
                },
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async addNewProduct(req) {
        try {
            const { name, description, price, stock, categoryId, imageUrls = null } = req;
            
            if (!name || !description || price == null || stock == null || !categoryId) {
                throw new Error('Missing required fields');
            }
            const result = await db.query('select * from create_product($1, $2, $3, $4, $5, $6)', [
                name,
                description,
                price,
                stock,
                categoryId,
                imageUrls,
            ]);

            if (!result || !result[0]) {
                throw new Error('Failed to create product');
            }

            return {
                id: result[0].id,
                name: result[0].name,
                price: result[0].price,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async updateProduct(data) {
        try {
            const id = data.id;
            
            const { name = null, description = null, price = null, stock = null, categoryId = null, imageUrls = null } = data;

            if (!id) {
                throw new Error('Product ID is required');
            }

            const result = await db.query('select * from update_product($1, $2, $3, $4, $5, $6, $7)', [
                id,
                name || null,
                description || null,
                price || null,
                stock || null,
                categoryId || null,
                imageUrls || null
            ]);
            if (!result || !result[0]) {
                throw new Error('Failed to update product');
            }

            return {
                id: result[0].product_id,
                name: result[0].product_name,
                price: result[0].product_price,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = Product;