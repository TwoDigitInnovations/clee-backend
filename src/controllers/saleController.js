const Sale = require('../models/Sale');
const Product = require('../models/Product');
const response = require('../responses');

const saleController = {
  createSale: async (req, res) => {
    try {
      const { customer, items, subtotal, tax, discount, total, paymentMethod, note } = req.body;

      // Validate only product items, skip services/vouchers/etc
      for (const item of items) {
        const itemType = item.itemType || 'product';
        
        // Only validate if it's a product
        if (itemType === 'product') {
          const product = await Product.findById(item.product);
          if (!product) {
            return response.error(res, { message: `Product ${item.product} not found` });
          }
          if (product.trackStock && product.stock < item.quantity) {
            return response.error(res, { message: `Insufficient stock for ${product.productName}` });
          }
        }
      }

      const sale = await Sale.create({
        customer: customer || null,
        items,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        note,
        createdBy: req.user?._id
      });

      // Update stock only for products
      for (const item of items) {
        const itemType = item.itemType || 'product';
        
        if (itemType === 'product') {
          const product = await Product.findById(item.product);
          if (product && product.trackStock) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }

      const populatedSale = await Sale.findById(sale._id)
        .populate('customer', 'fullname email mobile')
        .populate({
          path: 'items.product',
          select: 'productName skuHandle',
          // Don't fail if product doesn't exist (for services/vouchers)
          options: { strictPopulate: false }
        });

      return response.ok(res, {
        message: 'Sale created successfully',
        data: populatedSale
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllSales: async (req, res) => {
    try {
      const { startDate, endDate, customer, status } = req.query;
      const filter = {};

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      if (customer) filter.customer = customer;
      if (status) filter.status = status;

      const sales = await Sale.find(filter)
        .populate('customer', 'fullname email mobile')
        .populate('items.product', 'productName skuHandle')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Sales fetched successfully',
        data: sales
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getSaleById: async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('customer', 'fullname email mobile')
        .populate('items.product', 'productName skuHandle retailPrice');

      if (!sale) {
        return response.error(res, { message: 'Sale not found' });
      }

      return response.ok(res, {
        message: 'Sale fetched successfully',
        data: sale
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateSaleStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const sale = await Sale.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!sale) {
        return response.error(res, { message: 'Sale not found' });
      }

      return response.ok(res, {
        message: 'Sale status updated successfully',
        data: sale
      });
    } catch (error) {
      return response.error(res, error);
    }
  }
};

module.exports = saleController;
