const ProductRepository = require('../repositories/product.repository');

class Product {
    /**
     * Get products with filters
     * This is a thin wrapper around repository for backward compatibility
     */
    static async get(req) {
        try {
            // Handle single product by ID
            if (req.query.id) {
                const result = await ProductRepository.findById(parseInt(req.query.id));
                return result || null;
            }

            // Handle product list with filters
            const filters = {
                search: req.query.search || null,
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
                includeInactive: req.query.includeInactive === 'true' || false,
                page: req.query.page ? parseInt(req.query.page) : 1,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                sortBy: req.query.sortBy || 'id',
                sortOrder: req.query.sortOrder || 'asc',
            };

            const result = await ProductRepository.findAll(filters);
            
            return {
                products: result,
                pagination: {
                    page: filters.page,
                    pageSize: filters.pageSize,
                    total: result[0]?.total_count || 0,
                    totalPages: Math.ceil((result[0]?.total_count || 0) / filters.pageSize),
                },
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    /**
     * Create new product
     */
    static async addNewProduct(req) {
        try {
            const { name, description, price, stock, categoryId, imageUrls = null } = req;
            
            if (!name || !description || price == null || stock == null || !categoryId) {
                throw new Error('Missing required fields');
            }

            const result = await ProductRepository.create({
                name,
                description,
                price,
                stock,
                categoryId,
                imageUrls,
            });

            if (!result) {
                throw new Error('Failed to create product');
            }

            return {
                id: result.id,
                name: result.name,
                price: result.price,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    /**
     * Update product
     */
    static async updateProduct(data) {
        try {
            const id = data.id;
            
            const { name = null, description = null, price = null, stock = null, categoryId = null, imageUrls = null } = data;

            if (!id) {
                throw new Error('Product ID is required');
            }

            const result = await ProductRepository.update(parseInt(id), {
                name: name || null,
                description: description || null,
                price: price || null,
                stock: stock || null,
                categoryId: categoryId || null,
                imageUrls: imageUrls || null,
            });

            if (!result) {
                throw new Error('Failed to update product');
            }

            return {
                id: result.product_id,
                name: result.product_name,
                price: result.product_price,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = Product;