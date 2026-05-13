const Product = require('../models/Product');
const StockAdjustment = require('../models/StockAdjustment');
const response = require('../responses');

const productController = {
  createProduct: async (req, res) => {
    try {
      const payload = req.body;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return response.badReq(res, { message: 'User not authenticated' });
      }

      const product = await Product.create({
        productName: payload.productName,
        type: payload.type,
        skuHandle: payload.skuHandle,
        barcode: payload.barcode,
        description: payload.description,
        costPrice: Number(payload.costPrice),
        retailPrice: Number(payload.retailPrice),
        taxRate: payload.taxRate,
        priceIncludesTax: payload.priceIncludesTax === 'true',
        primarySupplier: payload.primarySupplier,
        supplierProductCode: payload.supplierProductCode,
        trackStock: payload.trackStock === 'true',
        allowOutOfStock: payload.allowOutOfStock === 'true',
        sendAlertEmails: payload.sendAlertEmails === 'true',
        locations: typeof payload.locations === 'string' ? JSON.parse(payload.locations) : payload.locations,
        photo: req.file ? req.file.path : null,
        createdBy: userId,
      });

      return response.ok(res, {
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const { type } = req.query;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return response.badReq(res, { message: 'User not authenticated' });
      }

      const filter = { createdBy: userId };
      if (type) {
        filter.type = type;
      }

      const products = await Product.find(filter)
        .populate('createdBy', 'fullname email')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Products fetched successfully',
        data: products,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return response.badReq(res, { message: 'User not authenticated' });
      }

      const product = await Product.findOne({ _id: id, createdBy: userId })
        .populate('createdBy', 'fullname email');

      if (!product) {
        return response.badReq(res, { message: 'Product not found or unauthorized' });
      }

      return response.ok(res, {
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return response.badReq(res, { message: 'User not authenticated' });
      }

      const existingProduct = await Product.findOne({ _id: id, createdBy: userId });
      if (!existingProduct) {
        return response.badReq(res, { message: 'Product not found or unauthorized' });
      }

      const updateData = {
        productName: payload.productName,
        type: payload.type,
        skuHandle: payload.skuHandle,
        barcode: payload.barcode,
        description: payload.description,
        costPrice: Number(payload.costPrice),
        retailPrice: Number(payload.retailPrice),
        taxRate: payload.taxRate,
        priceIncludesTax: payload.priceIncludesTax === 'true',
        primarySupplier: payload.primarySupplier,
        supplierProductCode: payload.supplierProductCode,
        trackStock: payload.trackStock === 'true',
        allowOutOfStock: payload.allowOutOfStock === 'true',
        sendAlertEmails: payload.sendAlertEmails === 'true',
        locations: typeof payload.locations === 'string' ? JSON.parse(payload.locations) : payload.locations,
      };

      if (req.file) {
        updateData.photo = req.file.path;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct) {
        return response.badReq(res, { message: 'Product not found' });
      }

      return response.ok(res, {
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return response.badReq(res, { message: 'User not authenticated' });
      }

      const product = await Product.findOneAndDelete({ _id: id, createdBy: userId });

      if (!product) {
        return response.badReq(res, { message: 'Product not found or unauthorized' });
      }

      return response.ok(res, {
        message: 'Product deleted successfully',
        data: product,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  adjustStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { adjustmentType, amount, reason, location } = req.body;

      const product = await Product.findById(id);

      if (!product) {
        return response.badReq(res, { message: 'Product not found' });
      }

      const locationIndex = product.locations.findIndex(
        (loc) => loc.name === location
      );

      if (locationIndex === -1) {
        return response.badReq(res, { message: 'Location not found' });
      }

      const previousAmount = product.locations[locationIndex].available;
      let newAmount;

      if (adjustmentType === 'set') {
        newAmount = Number(amount);
      } else if (adjustmentType === 'add') {
        newAmount = previousAmount + Number(amount);
      } else if (adjustmentType === 'reduce') {
        newAmount = Math.max(0, previousAmount - Number(amount));
      }

      product.locations[locationIndex].available = newAmount;
      await product.save();

      await StockAdjustment.create({
        product: id,
        location,
        adjustmentType,
        previousAmount,
        newAmount,
        changeAmount: newAmount - previousAmount,
        reason,
      });

      return response.ok(res, {
        message: 'Stock adjusted successfully',
        data: product,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getStockHistory: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await StockAdjustment.find({ product: id })
        .populate('product', 'productName')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Stock history fetched successfully',
        data: history,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = productController;
