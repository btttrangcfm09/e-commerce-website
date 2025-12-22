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
}

module.exports = Category;