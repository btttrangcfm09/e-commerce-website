const categoryService = require('../../services/category.service');

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all categories', error: err.message });
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const { includeTree } = req.query;
  try {
    const category = await categoryService.getCategoryById(id, includeTree === 'true');
    if (category) {
      res.status(200).json({ category });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category by ID', error: err.message });
  }
};

// Tính số lượng danh mục con
const countSubcategories = async (req, res) => {
  const { id } = req.params;
  const { maxDepth } = req.query;
  try {
    const count = await categoryService.countSubcategories(id, maxDepth ? parseInt(maxDepth) : null);
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error counting subcategories', error: err.message });
  }
};

// Tạo slug từ tên danh mục
const generateSlug = async (req, res) => {
  const { name } = req.body;
  try {
    const slug = await categoryService.generateSlug(name);
    res.status(200).json({ slug });
  } catch (err) {
    res.status(500).json({ message: 'Error generating category slug', error: err.message });
  }
};

// Lấy đường dẫn đầy đủ của danh mục
const getCategoryPath = async (req, res) => {
  const { id } = req.params;
  try {
    const path = await categoryService.getCategoryPath(id);
    res.status(200).json({ path });
  } catch (err) {
    res.status(500).json({ message: 'Error generating category path', error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  countSubcategories,
  generateSlug,
  getCategoryPath,
};