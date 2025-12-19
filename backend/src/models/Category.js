const db = require('../config/database');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.parentCategoryId = data.parent_category_id || data.parent_id || data.parentCategoryId || null;
    this.parentName = data.parent_name || null;
    this.fullPath = data.full_path || null;
  }

  static validate(category) {
    return !!(
      category.name && 
      category.name.trim().length >= 2
    );
  }

  static async get(categoryId, includeTree = false) {
    try {
      const result = await db.query(
        'SELECT * FROM get_category($1, $2)',
        [categoryId, includeTree]
      );      
      return result[0];
    } catch (err) {
      console.error('Fetch category error:', err);
      throw err;
    }
  }

  static async getAll() {
    try {
      const result = await db.query('SELECT * FROM categories');
      return result
    } catch (err) {
      console.error('Fetch categories error:', err);
      throw err;
    }
  }
  
  static async countSubcategories(categoryId, maxDepth = null) {
    try {
      const result = await db.query(
        'SELECT * FROM count_subcategories($1, $2)',
        [categoryId, maxDepth]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Subcategories count error:', err);
      throw err;
    }
  }

  static async generateSlug(categoryName) {
    try {
      const result = await db.query(
        'SELECT create_category_slug($1) AS slug',
        [categoryName]
      );
      return result[0].slug;
    } catch (err) {
      console.error('Category slug generation error:', err);
      throw err;
    }
  }

  static async getCategoryPath(categoryId) {
    try {
      const result = await db.query(
        'SELECT get_full_category_path($1) AS path',
        [categoryId]
      );
      return result[0].path;
    } catch (err) {
      console.error('Category path generation error:', err);
      throw err;
    }
  }
}

module.exports = Category;