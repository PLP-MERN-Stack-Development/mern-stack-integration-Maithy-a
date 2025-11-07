const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};
