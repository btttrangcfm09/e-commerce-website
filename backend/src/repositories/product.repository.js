const db = require('../config/database');

class ProductRepository {
    /**
     * Get products with filters, pagination and sorting
     */
    static async findAll(filters = {}) {
        const {
            search = null,
            categoryId = null,
            minPrice = null,
            maxPrice = null,
            includeInactive = false,
            page = 1,
            pageSize = 10,
            sortBy = 'id',
            sortOrder = 'asc'
        } = filters;

        // Validate sort parameters
        const validSortFields = ['id', 'name', 'price', 'stock'];
        const validSortOrders = ['asc', 'desc'];
        
        if (!validSortFields.includes(sortBy)) {
            throw new Error(`Invalid sort_by parameter. Must be one of: ${validSortFields.join(', ')}`);
        }
        
        if (!validSortOrders.includes(sortOrder.toLowerCase())) {
            throw new Error('Invalid sort_order parameter. Must be either asc or desc');
        }

        // Build the base query with CTE for category tree
        let query = `
            WITH RECURSIVE category_tree AS (
                SELECT id
                FROM categories
                WHERE id = COALESCE($2::integer, id)
                
                UNION ALL
                
                SELECT c.id
                FROM categories c
                INNER JOIN category_tree ct ON c.parent_category_id = ct.id
            )
            SELECT 
                p.id as product_id,
                p.name as product_name,
                p.description as product_description,
                p.price as product_price,
                p.stock as product_stock,
                p.image_urls as product_image_urls,
                p.category_id as category_id,
                c.name as category_name,
                (
                    WITH RECURSIVE cat_path AS (
                        SELECT id, name, parent_category_id, name::text as path
                        FROM categories
                        WHERE id = p.category_id
                        
                        UNION ALL
                        
                        SELECT c2.id, c2.name, c2.parent_category_id, 
                               c2.name || ' > ' || cp.path
                        FROM categories c2
                        INNER JOIN cat_path cp ON c2.id = cp.parent_category_id
                    )
                    SELECT path FROM cat_path WHERE parent_category_id IS NULL
                ) as category_path,
                p.is_active,
                COUNT(*) OVER() as total_count
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 
                ($1::text IS NULL OR (
                    p.name ILIKE '%' || $1 || '%' OR 
                    p.description ILIKE '%' || $1 || '%'
                ))
                AND ($2::integer IS NULL OR p.category_id IN (SELECT id FROM category_tree))
                AND ($3::decimal IS NULL OR p.price >= $3)
                AND ($4::decimal IS NULL OR p.price <= $4)
                AND ($5::boolean = true OR p.is_active = true)
        `;

        // Add dynamic sorting
        const sortField = sortBy === 'id' ? 'p.id' : 
                         sortBy === 'name' ? 'p.name' :
                         sortBy === 'price' ? 'p.price' : 'p.stock';
        
        query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
        query += ` LIMIT $6 OFFSET $7`;

        const offset = (page - 1) * pageSize;
        const values = [search, categoryId, minPrice, maxPrice, includeInactive, pageSize, offset];

        try {
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            console.error('Error in ProductRepository.findAll:', error);
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    static async findById(productId) {
        const query = `
            SELECT 
                p.id as product_id,
                p.name as product_name,
                p.description as product_description,
                p.price as product_price,
                p.stock as product_stock,
                p.image_urls as product_image_urls,
                c.id as category_id,
                c.name as category_name,
                p.is_active
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = $1
        `;

        try {
            const result = await db.query(query, [productId]);
            return result[0] || null;
        } catch (error) {
            console.error('Error in ProductRepository.findById:', error);
            throw error;
        }
    }

    /**
     * Create new product
     */
    static async create(productData) {
        const { name, description, price, stock, categoryId, imageUrls = null } = productData;

        // Validate category exists
        if (categoryId) {
            const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
            if (categoryCheck.length === 0) {
                throw new Error('Invalid category_id');
            }
        }

        const query = `
            INSERT INTO products (name, description, price, stock, category_id, image_urls)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, price
        `;

        const values = [name, description, price, stock, categoryId, imageUrls];

        try {
            const result = await db.query(query, values);
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.create:', error);
            throw error;
        }
    }

    /**
     * Update product
     */
    static async update(productId, productData) {
        const { name = null, description = null, price = null, stock = null, categoryId = null, imageUrls = null } = productData;

        // Validate category exists if provided
        if (categoryId) {
            const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
            if (categoryCheck.length === 0) {
                throw new Error('Invalid category_id');
            }
        }

        const query = `
            UPDATE products 
            SET 
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                price = COALESCE($4, price),
                stock = COALESCE($5, stock),
                category_id = COALESCE($6, category_id),
                image_urls = COALESCE($7, image_urls)
            WHERE id = $1
            RETURNING id as product_id, name as product_name, price as product_price
        `;

        const values = [productId, name, description, price, stock, categoryId, imageUrls];

        try {
            const result = await db.query(query, values);
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.update:', error);
            throw error;
        }
    }

    /**
     * Soft delete product (mark as inactive)
     */
    static async softDelete(productId) {
        const query = `
            UPDATE products 
            SET is_active = false
            WHERE id = $1
            RETURNING id, name
        `;

        try {
            const result = await db.query(query, [productId]);
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.softDelete:', error);
            throw error;
        }
    }

    /**
     * Hard delete product (only if no orders exist)
     */
    static async hardDelete(productId) {
        // Check if product exists in orders
        const orderCheck = await db.query(
            'SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1',
            [productId]
        );

        if (orderCheck.length > 0) {
            throw new Error('Cannot hard delete product: exists in orders');
        }

        try {
            // Remove from cart_items first (foreign key constraint)
            await db.query('DELETE FROM cart_items WHERE product_id = $1', [productId]);

            // Then delete product
            const query = 'DELETE FROM products WHERE id = $1 RETURNING id, name';
            const result = await db.query(query, [productId]);
            
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.hardDelete:', error);
            throw error;
        }
    }

    /**
     * Restore soft-deleted product
     */
    static async restore(productId) {
        const query = `
            UPDATE products 
            SET is_active = true
            WHERE id = $1
            RETURNING id, name
        `;

        try {
            const result = await db.query(query, [productId]);
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.restore:', error);
            throw error;
        }
    }

    /**
     * Check if product exists
     */
    static async exists(productId) {
        const query = 'SELECT 1 FROM products WHERE id = $1';
        try {
            const result = await db.query(query, [productId]);
            return result.length > 0;
        } catch (error) {
            console.error('Error in ProductRepository.exists:', error);
            throw error;
        }
    }

    /**
     * Get best selling products based on order quantity
     */
    static async findBestSelling(limit = 10) {
        const query = `
            SELECT 
                p.id as product_id,
                p.name as product_name,
                p.description as product_description,
                p.price as product_price,
                p.stock as product_stock,
                p.image_urls as product_image_urls,
                p.category_id as category_id,
                c.name as category_name,
                (
                    WITH RECURSIVE cat_path AS (
                        SELECT id, name, parent_category_id, name::text as path
                        FROM categories
                        WHERE id = p.category_id
                        
                        UNION ALL
                        
                        SELECT c2.id, c2.name, c2.parent_category_id, 
                               c2.name || ' > ' || cp.path
                        FROM categories c2
                        INNER JOIN cat_path cp ON c2.id = cp.parent_category_id
                    )
                    SELECT path FROM cat_path WHERE parent_category_id IS NULL
                ) as category_path,
                p.is_active,
                COALESCE(SUM(oi.quantity), 0) as total_sold
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE p.is_active = true
            GROUP BY p.id, c.name
            HAVING COALESCE(SUM(oi.quantity), 0) > 0
            ORDER BY total_sold DESC
            LIMIT $1
        `;

        try {
            const result = await db.query(query, [limit]);
            return result;
        } catch (error) {
            console.error('Error in ProductRepository.findBestSelling:', error);
            throw error;
        }
    }

    /**
     * Update stock quantity
     */
    static async updateStock(productId, quantity) {
        const query = `
            UPDATE products 
            SET stock = $2
            WHERE id = $1
            RETURNING id, stock
        `;

        try {
            const result = await db.query(query, [productId, quantity]);
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.updateStock:', error);
            throw error;
        }
    }

    /**
     * Check if product has orders
     */
    static async hasOrders(productId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM order_items WHERE product_id = $1
            ) as has_orders
        `;

        try {
            const result = await db.query(query, [productId]);
            return result[0].has_orders;
        } catch (error) {
            console.error('Error in ProductRepository.hasOrders:', error);
            throw error;
        }
    }

    /**
     * Delete product (soft or hard delete)
     */
    static async deleteProduct(productId, hardDelete = false) {
        try {
            if (hardDelete) {
                // Hard delete - remove from cart first, then delete product
                await db.query('DELETE FROM cart_items WHERE product_id = $1', [productId]);
                
                const query = `
                    DELETE FROM products 
                    WHERE id = $1
                    RETURNING id, name, 'HARD_DELETE' as deletion_type
                `;
                const result = await db.query(query, [productId]);
                
                if (result.length === 0) {
                    throw new Error('Product not found');
                }
                return result[0];
            } else {
                // Soft delete - set is_active = false
                const query = `
                    UPDATE products 
                    SET is_active = false
                    WHERE id = $1
                    RETURNING id, name, 'SOFT_DELETE' as deletion_type
                `;
                const result = await db.query(query, [productId]);
                
                if (result.length === 0) {
                    throw new Error('Product not found');
                }
                return result[0];
            }
        } catch (error) {
            console.error('Error in ProductRepository.deleteProduct:', error);
            throw error;
        }
    }

    /**
     * Restore soft-deleted product
     */
    static async restoreProduct(productId) {
        const query = `
            UPDATE products 
            SET is_active = true
            WHERE id = $1
            RETURNING id, name
        `;

        try {
            const result = await db.query(query, [productId]);
            if (result.length === 0) {
                throw new Error('Product not found');
            }
            return result[0];
        } catch (error) {
            console.error('Error in ProductRepository.restoreProduct:', error);
            throw error;
        }
    }
}

module.exports = ProductRepository;
