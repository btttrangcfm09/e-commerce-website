/**
 * Product Matcher Service
 * Purpose: Find products from database based on AI-extracted criteria
 * This service bridges AI understanding and database queries
 */

const db = require('../../config/database');

class ProductMatcherService {
    /**
     * Find products matching the search criteria
     * Uses intelligent SQL queries to match user's requirements
     * IMPROVED: More flexible matching with better scoring
     */
    async findMatchingProducts(criteria, limit = 5) {
        try {
            // Build dynamic SQL query with relevance scoring
            let query = `
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    p.image_urls,
                    p.tags,
                    p.category_id,
                    c.name as category_name,
                    0 as relevance_score
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_active = true
                AND p.stock > 0
            `;

            const params = [];
            let paramIndex = 1;
            let hasFilters = false;

            // Build search conditions
            const searchConditions = [];

            // Category filter - STRICT REQUIREMENT (must match exactly)
            // This is applied as AND condition, not OR
            if (criteria.category) {
                query += ` AND (
                    LOWER(p.name) LIKE LOWER($${paramIndex}) 
                    OR LOWER(p.description) LIKE LOWER($${paramIndex})
                    OR LOWER(c.name) LIKE LOWER($${paramIndex})
                    OR (p.tags IS NOT NULL AND $${paramIndex} = ANY(SELECT LOWER(unnest(p.tags))))
                )`;
                params.push(`%${criteria.category}%`);
                paramIndex++;
                hasFilters = true;
            }

            // Keywords filter (search across multiple fields)
            if (criteria.keywords && criteria.keywords.length > 0) {
                criteria.keywords.forEach(keyword => {
                    searchConditions.push(`(
                        LOWER(p.name) LIKE LOWER($${paramIndex})
                        OR LOWER(p.description) LIKE LOWER($${paramIndex})
                        OR LOWER(p.ai_description) LIKE LOWER($${paramIndex})
                        OR LOWER(c.name) LIKE LOWER($${paramIndex})
                        OR (p.tags IS NOT NULL AND $${paramIndex} = ANY(SELECT LOWER(unnest(p.tags))))
                    )`);
                    params.push(`%${keyword}%`);
                    paramIndex++;
                    hasFilters = true;
                });
            }

            // Color filter
            if (criteria.color) {
                searchConditions.push(`(
                    LOWER(p.name) LIKE LOWER($${paramIndex})
                    OR LOWER(p.description) LIKE LOWER($${paramIndex})
                    OR (p.tags IS NOT NULL AND $${paramIndex} = ANY(SELECT LOWER(unnest(p.tags))))
                )`);
                params.push(`%${criteria.color}%`);
                paramIndex++;
                hasFilters = true;
            }

            // Brand filter (Apple, Samsung, Sony, etc.)
            if (criteria.brand) {
                searchConditions.push(`(
                    LOWER(p.name) LIKE LOWER($${paramIndex})
                    OR LOWER(p.description) LIKE LOWER($${paramIndex})
                    OR (p.tags IS NOT NULL AND $${paramIndex} = ANY(SELECT LOWER(unnest(p.tags))))
                )`);
                params.push(`%${criteria.brand}%`);
                paramIndex++;
                hasFilters = true;
            }

            // Add search conditions with OR (more flexible)
            if (searchConditions.length > 0) {
                query += ` AND (${searchConditions.join(' OR ')})`;
            }

            // Price range filters (STRICT - always applied if specified)
            if (criteria.minPrice !== null && criteria.minPrice !== undefined) {
                query += ` AND p.price >= $${paramIndex}`;
                params.push(criteria.minPrice);
                paramIndex++;
            }

            if (criteria.maxPrice !== null && criteria.maxPrice !== undefined) {
                query += ` AND p.price <= $${paramIndex}`;
                params.push(criteria.maxPrice);
                paramIndex++;
            }

            // Order by relevance and price
            query += `
                ORDER BY 
                    p.created_at DESC,
                    p.price ASC
                LIMIT $${paramIndex}
            `;
            params.push(limit);

            const products = await db.query(query, params);

            // STRICT MODE: Return empty if no exact matches
            // Do NOT fallback to relaxed search or trending products
            // This ensures users only see products matching their criteria
            return products;

        } catch (error) {
            console.error('Error finding matching products:', error);
            // Return empty array on error, not fallback products
            return [];
        }
    }

    /**
     * Relaxed search when strict criteria returns no results
     * Removes some filters to find similar products
     */
    async findRelaxedMatch(criteria, limit = 5) {
        try {
            let query = `
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    p.image_urls,
                    p.tags,
                    p.category_id,
                    c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_active = true
                AND p.stock > 0
            `;

            const params = [];
            let paramIndex = 1;

            // Only search by category or first keyword
            const searchTerm = criteria.category || (criteria.keywords && criteria.keywords[0]);
            if (searchTerm) {
                query += ` AND (
                    LOWER(p.name) LIKE LOWER($${paramIndex})
                    OR LOWER(c.name) LIKE LOWER($${paramIndex})
                )`;
                params.push(`%${searchTerm}%`);
                paramIndex++;
            }

            query += ` ORDER BY p.price ASC LIMIT $${paramIndex}`;
            params.push(limit);

            return await db.query(query, params);

        } catch (error) {
            console.error('Error in relaxed search:', error);
            return [];
        }
    }

    /**
     * Get similar products based on a specific product
     * Useful for "customers also bought" recommendations
     */
    async findSimilarProducts(productId, limit = 4) {
        try {
            const query = `
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    p.image_urls,
                    p.tags,
                    p.category_id,
                    c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_active = true
                AND p.stock > 0
                AND p.category_id = (SELECT category_id FROM products WHERE id = $1)
                AND p.id != $1
                ORDER BY ABS(p.price - (SELECT price FROM products WHERE id = $1))
                LIMIT $2
            `;

            return await db.query(query, [productId, limit]);

        } catch (error) {
            console.error('Error finding similar products:', error);
            return [];
        }
    }

    /**
     * Get trending/popular products when user query is too vague
     * IMPROVED: Add randomization to avoid showing same products
     */
    async getTrendingProducts(limit = 5) {
        try {
            const query = `
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    p.image_urls,
                    p.tags,
                    p.category_id,
                    c.name as category_name,
                    COUNT(oi.id) as order_count
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN order_items oi ON p.id = oi.product_id
                WHERE p.is_active = true
                AND p.stock > 0
                GROUP BY p.id, c.name
                ORDER BY RANDOM(), order_count DESC
                LIMIT $1
            `;

            return await db.query(query, [limit]);

        } catch (error) {
            console.error('Error getting trending products:', error);
            return [];
        }
    }

    /**
     * Format products for display
     * Adds computed fields and formats data
     */
    formatProducts(products) {
        return products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            formattedPrice: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(product.price),
            stock: product.stock,
            imageUrls: product.image_urls || [],
            tags: product.tags || [],
            category: {
                id: product.category_id,
                name: product.category_name
            },
            inStock: product.stock > 0
        }));
    }
}

module.exports = new ProductMatcherService();
