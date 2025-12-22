const CategoryRepository = require('../repositories/category.repository');

/**
 * Get all categories with optional tree structure
 * Business logic layer that uses repository
 */
const getAllCategories = async (options = {}) => {
  try {
    const { includeTree = false } = options;

    // Get categories from repository
    const categories = await CategoryRepository.findAll({ includeTree });

    // Business logic: format response
    if (!categories || categories.length === 0) {
      return [];
    }

    return categories;
  } catch (err) {
    throw new Error('Error fetching all categories: ' + err.message);
  }
};

/**
 * Get category by ID with optional tree structure
 * Business logic layer that uses repository
 */
const getCategoryById = async (categoryId, includeTree = false) => {
  try {
    // Validate categoryId
    const parsedId = parseInt(categoryId);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid category ID. Must be a positive integer.');
    }

    // Get category from repository
    const category = await CategoryRepository.findById(parsedId, { includeTree });

    // Business logic: check if category exists
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    return category;
  } catch (err) {
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};

/**
 * Count subcategories with validation
 */
const countSubcategories = async (categoryId, maxDepth = null) => {
  try {
    // Validate categoryId
    const parsedId = parseInt(categoryId);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid category ID. Must be a positive integer.');
    }

    // Validate maxDepth if provided
    if (maxDepth !== null) {
      const parsedDepth = parseInt(maxDepth);
      if (isNaN(parsedDepth) || parsedDepth < 0) {
        throw new Error('Invalid maxDepth. Must be a non-negative integer or null.');
      }
      maxDepth = parsedDepth;
    }

    // Check if category exists
    const exists = await CategoryRepository.exists(parsedId);
    if (!exists) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Get count from repository
    const count = await CategoryRepository.countSubcategories(parsedId, maxDepth);

    return { 
      categoryId: parsedId, 
      count: parseInt(count),
      maxDepth: maxDepth 
    };
  } catch (err) {
    throw new Error('Error counting subcategories: ' + err.message);
  }
};

/**
 * Generate slug from category name with validation
 */
const generateSlug = async (categoryName) => {
  try {
    // Validate categoryName
    if (!categoryName || typeof categoryName !== 'string') {
      throw new Error('Category name is required and must be a string');
    }

    const trimmedName = categoryName.trim();
    if (trimmedName.length < 2) {
      throw new Error('Category name must be at least 2 characters long');
    }

    if (trimmedName.length > 100) {
      throw new Error('Category name must not exceed 100 characters');
    }

    // Generate slug using repository
    const slug = CategoryRepository.generateSlug(trimmedName);

    return { 
      originalName: categoryName,
      slug: slug 
    };
  } catch (err) {
    throw new Error('Error generating category slug: ' + err.message);
  }
};

/**
 * Get category path (breadcrumb) with validation
 */
const getCategoryPath = async (categoryId) => {
  try {
    // Validate categoryId
    const parsedId = parseInt(categoryId);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid category ID. Must be a positive integer.');
    }

    // Check if category exists
    const exists = await CategoryRepository.exists(parsedId);
    if (!exists) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Get path from repository
    const path = await CategoryRepository.getCategoryPath(parsedId);

    return { 
      categoryId: parsedId,
      path: path || ''
    };
  } catch (err) {
    throw new Error('Error generating category path: ' + err.message);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  countSubcategories,
  generateSlug,
  getCategoryPath,
};