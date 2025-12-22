const db = require('../config/database');

class CategoryRepository {
    /**
     * Get all categories with optional tree structure
     */
    static async findAll(options = {}) {
        const { includeTree = false } = options;

        let query;
        
        if (includeTree) {
            // Get categories with hierarchical structure using recursive CTE
            query = `
                WITH RECURSIVE category_tree AS (
                    -- Base case: get root categories (no parent)
                    SELECT 
                        id,
                        name,
                        parent_category_id,
                        name::text as full_path,
                        0 as level
                    FROM categories
                    WHERE parent_category_id IS NULL
                    
                    UNION ALL
                    
                    -- Recursive case: get child categories
                    SELECT 
                        c.id,
                        c.name,
                        c.parent_category_id,
                        ct.full_path || ' > ' || c.name as full_path,
                        ct.level + 1 as level
                    FROM categories c
                    INNER JOIN category_tree ct ON c.parent_category_id = ct.id
                )
                SELECT 
                    id,
                    name,
                    parent_category_id,
                    full_path,
                    level
                FROM category_tree
                ORDER BY full_path
            `;
        } else {
            // Simple query to get all categories
            query = `
                SELECT 
                    id,
                    name,
                    parent_category_id
                FROM categories
                ORDER BY id
            `;
        }

        try {
            const result = await db.query(query);
            return result;
        } catch (error) {
            console.error('Repository error fetching all categories:', error);
            throw error;
        }
    }

    /**
     * Get category by ID with optional tree information
     */
    static async findById(categoryId, options = {}) {
        const { includeTree = false } = options;

        let query;

        if (includeTree) {
            // Get category with full path and subcategories
            query = `
                WITH RECURSIVE 
                -- Get parent path (from current to root)
                parent_path AS (
                    SELECT 
                        id,
                        name,
                        parent_category_id,
                        name::text as path,
                        0 as level
                    FROM categories
                    WHERE id = $1
                    
                    UNION ALL
                    
                    SELECT 
                        c.id,
                        c.name,
                        c.parent_category_id,
                        c.name || ' > ' || pp.path as path,
                        pp.level + 1 as level
                    FROM categories c
                    INNER JOIN parent_path pp ON c.id = pp.parent_category_id
                ),
                -- Get all subcategories (from current to leaves)
                subcategories AS (
                    SELECT 
                        id,
                        name,
                        parent_category_id,
                        0 as depth
                    FROM categories
                    WHERE id = $1
                    
                    UNION ALL
                    
                    SELECT 
                        c.id,
                        c.name,
                        c.parent_category_id,
                        sc.depth + 1 as depth
                    FROM categories c
                    INNER JOIN subcategories sc ON c.parent_category_id = sc.id
                )
                SELECT 
                    c.id,
                    c.name,
                    c.parent_category_id,
                    pc.name as parent_name,
                    (SELECT path FROM parent_path ORDER BY level DESC LIMIT 1) as full_path,
                    (SELECT COUNT(*) - 1 FROM subcategories) as subcategory_count,
                    (SELECT json_agg(json_build_object('id', id, 'name', name)) 
                     FROM subcategories 
                     WHERE id != $1) as subcategories
                FROM categories c
                LEFT JOIN categories pc ON c.parent_category_id = pc.id
                WHERE c.id = $1
            `;
        } else {
            // Simple query to get category by ID
            query = `
                SELECT 
                    c.id,
                    c.name,
                    c.parent_category_id,
                    pc.name as parent_name
                FROM categories c
                LEFT JOIN categories pc ON c.parent_category_id = pc.id
                WHERE c.id = $1
            `;
        }

        try {
            const result = await db.query(query, [categoryId]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Repository error fetching category by ID:', error);
            throw error;
        }
    }

    /**
     * Get category path (breadcrumb)
     */
    static async getCategoryPath(categoryId) {
        const query = `
            WITH RECURSIVE category_path AS (
                SELECT 
                    id,
                    name,
                    parent_category_id,
                    name::text as path,
                    1 as level
                FROM categories
                WHERE id = $1
                
                UNION ALL
                
                SELECT 
                    c.id,
                    c.name,
                    c.parent_category_id,
                    c.name || ' > ' || cp.path as path,
                    cp.level + 1 as level
                FROM categories c
                INNER JOIN category_path cp ON c.id = cp.parent_category_id
            )
            SELECT path 
            FROM category_path 
            WHERE parent_category_id IS NULL
        `;

        try {
            const result = await db.query(query, [categoryId]);
            return result.length > 0 ? result[0].path : null;
        } catch (error) {
            console.error('Repository error getting category path:', error);
            throw error;
        }
    }

    /**
     * Count subcategories
     */
    static async countSubcategories(categoryId, maxDepth = null) {
        const query = `
            WITH RECURSIVE subcategories AS (
                SELECT 
                    id,
                    name,
                    parent_category_id,
                    0 as depth
                FROM categories
                WHERE id = $1
                
                UNION ALL
                
                SELECT 
                    c.id,
                    c.name,
                    c.parent_category_id,
                    sc.depth + 1 as depth
                FROM categories c
                INNER JOIN subcategories sc ON c.parent_category_id = sc.id
                WHERE $2::integer IS NULL OR sc.depth < $2
            )
            SELECT COUNT(*) - 1 as count
            FROM subcategories
        `;

        try {
            const result = await db.query(query, [categoryId, maxDepth]);
            return result[0].count;
        } catch (error) {
            console.error('Repository error counting subcategories:', error);
            throw error;
        }
    }

    /**
     * Generate slug from category name
     */
    static generateSlug(categoryName) {
        return categoryName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Check if category exists
     */
    static async exists(categoryId) {
        const query = 'SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1) as exists';
        
        try {
            const result = await db.query(query, [categoryId]);
            return result[0].exists;
        } catch (error) {
            console.error('Repository error checking category existence:', error);
            throw error;
        }
    }

    /**
     * Create new category
     */
    static async create(categoryData) {
        const { name, parentCategoryId = null } = categoryData;

        // Validate parent category exists if provided
        if (parentCategoryId) {
            const parentExists = await this.exists(parentCategoryId);
            if (!parentExists) {
                throw new Error(`Parent category with ID ${parentCategoryId} does not exist`);
            }
        }

        const query = `
            INSERT INTO categories (name, parent_category_id)
            VALUES ($1, $2)
            RETURNING id, name, parent_category_id
        `;

        try {
            const result = await db.query(query, [name, parentCategoryId]);
            return result[0];
        } catch (error) {
            console.error('Repository error creating category:', error);
            throw error;
        }
    }

    /**
     * Update category
     */
    static async update(categoryId, categoryData) {
        const { name = null, parentCategoryId = null } = categoryData;

        // Validate parent category exists if provided
        if (parentCategoryId) {
            const parentExists = await this.exists(parentCategoryId);
            if (!parentExists) {
                throw new Error(`Parent category with ID ${parentCategoryId} does not exist`);
            }

            // Prevent circular reference (category can't be its own parent)
            if (parseInt(parentCategoryId) === parseInt(categoryId)) {
                throw new Error('Category cannot be its own parent');
            }
        }

        const query = `
            UPDATE categories 
            SET 
                name = COALESCE($2, name),
                parent_category_id = COALESCE($3, parent_category_id)
            WHERE id = $1
            RETURNING id, name, parent_category_id
        `;

        try {
            const result = await db.query(query, [categoryId, name, parentCategoryId]);
            
            if (result.length === 0) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            
            return result[0];
        } catch (error) {
            console.error('Repository error updating category:', error);
            throw error;
        }
    }

    /**
     * Delete category (only if no products or subcategories exist)
     */
    static async delete(categoryId) {
        // Check if category has products
        const productCheck = await db.query(
            'SELECT 1 FROM products WHERE category_id = $1 LIMIT 1',
            [categoryId]
        );

        if (productCheck.length > 0) {
            throw new Error('Cannot delete category with existing products');
        }

        // Check if category has subcategories
        const subcategoryCheck = await db.query(
            'SELECT 1 FROM categories WHERE parent_category_id = $1 LIMIT 1',
            [categoryId]
        );

        if (subcategoryCheck.length > 0) {
            throw new Error('Cannot delete category with existing subcategories');
        }

        const query = `
            DELETE FROM categories 
            WHERE id = $1
            RETURNING id, name
        `;

        try {
            const result = await db.query(query, [categoryId]);
            
            if (result.length === 0) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            
            return result[0];
        } catch (error) {
            console.error('Repository error deleting category:', error);
            throw error;
        }
    }
}

module.exports = CategoryRepository;
