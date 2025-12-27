const db = require('../config/database');

/**
 * Recommendation Repository
 * Purpose: Handle all product recommendation queries
 * 
 * Strategies:
 * 1. Similar products based on category + tags
 * 2. Frequently bought together
 * 3. Based on user's view history
 * 4. Based on user's purchase history
 * 5. Trending products in category
 */
class RecommendationRepository {
    
    /**
     * Track product view
     * Call this whenever a user views a product
     */
    static async trackProductView(userId, productId, sessionId = null) {
        try {
            const query = `
                INSERT INTO public.product_views (user_id, product_id, session_id, viewed_at)
                VALUES ($1, $2, $3, NOW())
            `;
            await db.query(query, [userId, productId, sessionId]);
            return true;
        } catch (error) {
            console.error('Error tracking product view:', error);
            return false;
        }
    }

    /**
     * Get similar products based on category, tags, and price range
     * STRICT MODE: Must be same category OR parent category for accurate recommendations
     */
    static async getSimilarProducts(productId, limit = 8) {
        try {
            const query = `
                WITH target_product AS (
                    SELECT 
                        p.id,
                        p.category_id,
                        p.tags,
                        p.price,
                        p.name,
                        -- Get parent category if exists
                        COALESCE(pc.id, p.category_id) as parent_category_id
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN categories pc ON c.parent_category_id = pc.id
                    WHERE p.id = $1 AND p.is_active = true
                ),
                similar_products AS (
                    SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name,
                        -- Calculate similarity score
                        (
                            -- Exact same category: +70 points
                            CASE WHEN p.category_id = tp.category_id THEN 70
                            -- Same parent category: +50 points
                            WHEN COALESCE(pc.id, p.category_id) = tp.parent_category_id THEN 50
                            ELSE 0 END +
                            
                            -- Similar price range (within 50%): +20 points
                            CASE 
                                WHEN p.price BETWEEN tp.price * 0.5 AND tp.price * 1.5 
                                THEN 20 
                                ELSE 0 
                            END +
                            
                            -- Matching tags: +5 points per tag (up to 10 points)
                            LEAST(
                                COALESCE(
                                    (
                                        SELECT COUNT(*) * 5
                                        FROM unnest(p.tags) AS p_tag
                                        WHERE p_tag = ANY(tp.tags)
                                    ),
                                    0
                                ),
                                10
                            )
                        ) as similarity_score
                    FROM products p
                    CROSS JOIN target_product tp
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN categories pc ON c.parent_category_id = pc.id
                    WHERE p.id != $1
                        AND p.is_active = true
                        AND p.stock > 0
                        -- STRICT: Must be same category OR same parent category
                        AND (
                            p.category_id = tp.category_id 
                            OR COALESCE(pc.id, p.category_id) = tp.parent_category_id
                        )
                )
                SELECT *
                FROM similar_products
                WHERE similarity_score >= 50  -- Must have at least category/parent match
                ORDER BY similarity_score DESC, id DESC
                LIMIT $2
            `;
            
            const result = await db.query(query, [productId, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting similar products:', error);
            return [];
        }
    }

    /**
     * Get products frequently bought together
     * PRIORITIZE same category products for better accuracy
     */
    static async getFrequentlyBoughtTogether(productId, limit = 4) {
        try {
            const query = `
                WITH target_product AS (
                    SELECT category_id
                    FROM products
                    WHERE id = $1
                ),
                product_orders AS (
                    -- Find all orders containing the target product
                    SELECT DISTINCT oi.order_id
                    FROM order_items oi
                    WHERE oi.product_id = $1
                ),
                related_products AS (
                    -- Find other products in those same orders
                    SELECT 
                        oi.product_id,
                        COUNT(*) as frequency,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name,
                        -- Boost score for same category
                        CASE 
                            WHEN p.category_id = (SELECT category_id FROM target_product)
                            THEN COUNT(*) * 2  -- 2x boost for same category
                            ELSE COUNT(*)
                        END as weighted_frequency
                    FROM order_items oi
                    JOIN product_orders po ON po.order_id = oi.order_id
                    JOIN products p ON p.id = oi.product_id
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE oi.product_id != $1
                        AND p.is_active = true
                        AND p.stock > 0
                    GROUP BY oi.product_id, p.name, p.description, p.price, 
                             p.stock, p.image_urls, p.category_id, c.name
                )
                SELECT 
                    product_id as id,
                    name,
                    description,
                    price,
                    stock,
                    image_urls,
                    category_id,
                    category_name,
                    frequency
                FROM related_products
                ORDER BY weighted_frequency DESC, product_id DESC
                LIMIT $2
            `;
            
            const result = await db.query(query, [productId, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting frequently bought together:', error);
            return [];
        }
    }

    /**
     * Get personalized recommendations based on user's view history
     * "Because you viewed áo sơ mi, we recommend quần tây"
     */
    static async getPersonalizedRecommendations(userId, limit = 8, excludeProductIds = []) {
        try {
            // Get user's recently viewed categories and tags
            const query = `
                WITH user_preferences AS (
                    SELECT 
                        p.category_id,
                        unnest(p.tags) as tag,
                        COUNT(*) as view_count
                    FROM product_views pv
                    JOIN products p ON p.id = pv.product_id
                    WHERE pv.user_id = $1
                        AND pv.viewed_at >= NOW() - INTERVAL '30 days'
                    GROUP BY p.category_id, tag
                ),
                recommended_products AS (
                    SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name,
                        -- Calculate relevance score
                        (
                            -- Match category: +50 points * view_count
                            COALESCE(
                                (
                                    SELECT SUM(view_count * 50)
                                    FROM user_preferences up
                                    WHERE up.category_id = p.category_id
                                ),
                                0
                            ) +
                            -- Match tags: +20 points per tag * view_count
                            COALESCE(
                                (
                                    SELECT SUM(view_count * 20)
                                    FROM user_preferences up
                                    WHERE up.tag = ANY(p.tags)
                                ),
                                0
                            )
                        ) as relevance_score
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = true
                        AND p.stock > 0
                        AND p.id != ALL($2::integer[])  -- Exclude already viewed/purchased
                )
                SELECT *
                FROM recommended_products
                WHERE relevance_score > 0
                ORDER BY relevance_score DESC, id DESC
                LIMIT $3
            `;
            
            const result = await db.query(query, [userId, excludeProductIds, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            return [];
        }
    }

    /**
     * Get recommendations based on user's purchase history
     * "Because you bought X, you might like Y"
     */
    static async getRecommendationsFromPurchaseHistory(userId, limit = 8) {
        try {
            const query = `
                WITH purchased_products AS (
                    -- Get all products user has purchased
                    SELECT DISTINCT oi.product_id
                    FROM orders o
                    JOIN order_items oi ON oi.order_id = o.id
                    WHERE o.customer_id = $1
                        AND o.order_status != 'CANCELED'
                ),
                purchased_categories_tags AS (
                    -- Get categories and tags from purchased products
                    SELECT 
                        p.category_id,
                        unnest(p.tags) as tag
                    FROM purchased_products pp
                    JOIN products p ON p.id = pp.product_id
                ),
                recommended AS (
                    SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name,
                        -- Score based on matching categories and tags
                        (
                            (SELECT COUNT(*) FROM purchased_categories_tags pct 
                             WHERE pct.category_id = p.category_id) * 40 +
                            (SELECT COUNT(*) FROM purchased_categories_tags pct 
                             WHERE pct.tag = ANY(p.tags)) * 10
                        ) as match_score
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = true
                        AND p.stock > 0
                        AND p.id NOT IN (SELECT product_id FROM purchased_products)
                )
                SELECT *
                FROM recommended
                WHERE match_score > 0
                ORDER BY match_score DESC, id DESC
                LIMIT $2
            `;
            
            const result = await db.query(query, [userId, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting purchase-based recommendations:', error);
            return [];
        }
    }

    /**
     * Get trending products in the same category
     * Based on recent views and purchases
     */
    static async getTrendingInCategory(categoryId, excludeProductId = null, limit = 8) {
        try {
            const query = `
                WITH product_metrics AS (
                    SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name,
                        -- Count recent views (last 7 days)
                        COALESCE(
                            (
                                SELECT COUNT(*)
                                FROM product_views pv
                                WHERE pv.product_id = p.id
                                    AND pv.viewed_at >= NOW() - INTERVAL '7 days'
                            ),
                            0
                        ) as recent_views,
                        -- Count recent purchases (last 30 days)
                        COALESCE(
                            (
                                SELECT COUNT(*)
                                FROM order_items oi
                                JOIN orders o ON o.id = oi.order_id
                                WHERE oi.product_id = p.id
                                    AND o.created_at >= NOW() - INTERVAL '30 days'
                                    AND o.order_status != 'CANCELED'
                            ),
                            0
                        ) as recent_purchases
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.category_id = $1
                        AND p.is_active = true
                        AND p.stock > 0
                        AND ($2::integer IS NULL OR p.id != $2)
                )
                SELECT *,
                    (recent_views * 1 + recent_purchases * 10) as trending_score
                FROM product_metrics
                ORDER BY trending_score DESC, id DESC
                LIMIT $3
            `;
            
            const result = await db.query(query, [categoryId, excludeProductId, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting trending products:', error);
            return [];
        }
    }

    /**
     * Get user's recently viewed products
     */
    static async getRecentlyViewed(userId, limit = 10) {
        try {
            const query = `
                SELECT DISTINCT ON (p.id)
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    p.image_urls,
                    p.category_id,
                    c.name as category_name,
                    pv.viewed_at
                FROM product_views pv
                JOIN products p ON p.id = pv.product_id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE pv.user_id = $1
                    AND p.is_active = true
                    AND p.stock > 0
                ORDER BY p.id, pv.viewed_at DESC
                LIMIT $2
            `;
            
            const result = await db.query(query, [userId, limit]);
            return result || [];
        } catch (error) {
            console.error('Error getting recently viewed:', error);
            return [];
        }
    }

    /**
     * Get comprehensive recommendations for a product page
     * STRICT: Only same category or related products
     */
    static async getProductPageRecommendations(productId, userId = null, limit = 8) {
        try {
            // 1. Try similar products first (STRICT: same category only)
            let recommendations = await this.getSimilarProducts(productId, limit);
            
            // 2. If not enough, add frequently bought together (prioritize same category)
            if (recommendations.length < limit) {
                const boughtTogether = await this.getFrequentlyBoughtTogether(
                    productId, 
                    limit - recommendations.length
                );
                recommendations = [...recommendations, ...boughtTogether];
            }
            
            // 3. If STILL not enough, get trending from SAME category
            if (recommendations.length < limit) {
                // Get product's category
                const productQuery = `SELECT category_id FROM products WHERE id = $1`;
                const productResult = await db.query(productQuery, [productId]);
                
                if (productResult.length > 0) {
                    const categoryId = productResult[0].category_id;
                    const excludeIds = [productId, ...recommendations.map(p => p.id)];
                    
                    const trending = await this.getTrendingInCategory(
                        categoryId,
                        productId,
                        limit - recommendations.length
                    );
                    
                    // Only add trending if they're not already in recommendations
                    const trendingFiltered = trending.filter(t => !excludeIds.includes(t.id));
                    recommendations = [...recommendations, ...trendingFiltered];
                }
            }
            
            // Remove duplicates by id
            const uniqueRecommendations = Array.from(
                new Map(recommendations.map(item => [item.id, item])).values()
            );
            
            return uniqueRecommendations.slice(0, limit);
        } catch (error) {
            console.error('Error getting product page recommendations:', error);
            return [];
        }
    }

    /**
     * Get recommendations for homepage
     * Mix of trending, personalized, and popular products
     */
    static async getHomepageRecommendations(userId = null, limit = 12) {
        try {
            let recommendations = [];
            
            // If user is logged in, get personalized recommendations
            if (userId) {
                recommendations = await this.getPersonalizedRecommendations(userId, Math.ceil(limit / 2));
            }
            
            // Fill remaining with trending products from different categories
            if (recommendations.length < limit) {
                const query = `
                    SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        p.image_urls,
                        p.category_id,
                        c.name as category_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = true
                        AND p.stock > 0
                    ORDER BY p.created_at DESC
                    LIMIT $1
                `;
                
                const trending = await db.query(query, [limit - recommendations.length]);
                recommendations = [...recommendations, ...trending];
            }
            
            return recommendations.slice(0, limit);
        } catch (error) {
            console.error('Error getting homepage recommendations:', error);
            return [];
        }
    }
}

module.exports = RecommendationRepository;
