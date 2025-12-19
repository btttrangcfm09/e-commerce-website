const Category = require('../models/Category');

// Lấy tất cả danh mục
const getAllCategories = async () => {
  try {
    return await Category.getAll();
  } catch (err) {
    throw new Error('Error fetching all categories: ' + err.message);
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (categoryId, includeTree = false) => {
  try {
    return await Category.get(categoryId, includeTree);
  } catch (err) {
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};

// Tính số lượng danh mục con
const countSubcategories = async (categoryId, maxDepth = null) => {
  try {
    return await Category.countSubcategories(categoryId, maxDepth);
  } catch (err) {
    throw new Error('Error counting subcategories: ' + err.message);
  }
};

// Tạo slug từ tên danh mục
const generateSlug = async (categoryName) => {
  try {
    return await Category.generateSlug(categoryName);
  } catch (err) {
    throw new Error('Error generating category slug: ' + err.message);
  };
}  

// Lấy đường dẫn đầy đủ của danh mục
const getCategoryPath = async (categoryId) => {
  try {
    return await Category.getCategoryPath(categoryId);
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