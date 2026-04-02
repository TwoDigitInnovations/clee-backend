const Category = require('@models/Category');
const response = require('../responses');

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return response.badReq(res, { message: 'Category name is required' });
      }

      const category = await Category.create({ name });

      return response.ok(res, {
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Categories fetched successfully',
        data: categories,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
        return response.badReq(res, { message: 'Category not found' });
      }

      return response.ok(res, {
        message: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true },
      );

      if (!category) {
        return response.badReq(res, { message: 'Category not found' });
      }

      return response.ok(res, {
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return response.badReq(res, { message: 'Category not found' });
      }

      return response.ok(res, {
        message: 'Category deleted successfully',
        data: category,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = categoryController;
