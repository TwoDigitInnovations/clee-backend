const StockOrder = require('../models/StockOrder');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const response = require('../responses');

const stockOrderController = {

  createStockOrder: async (req, res) => {
    try {
      const { supplier, items, notes } = req.body;

    
      const supplierDoc = await Supplier.findById(supplier);
      if (!supplierDoc) {
        return response.badReq(res, { message: 'Supplier not found' });
      }

   
      const timestamp = Date.now().toString().slice(-6);
      const count = await StockOrder.countDocuments();
      const orderNumber = `${count + 1}-${timestamp}`;

     
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return response.badReq(res, { message: `Product not found: ${item.product}` });
        }

        const unitPrice = item.unitPrice || product.costPrice || 0;
        const totalPrice = unitPrice * item.quantity;
        totalAmount += totalPrice;

        orderItems.push({
          product: item.product,
          productName: product.productName,
          quantity: item.quantity,
          unitPrice,  
          totalPrice,
        });
      }

      const stockOrder = await StockOrder.create({
        orderNumber,
        supplier,
        supplierName: supplierDoc.businessName,
        items: orderItems,
        notes,
        totalAmount,
      });

      return response.ok(res, {
        message: 'Stock order created successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  getAllStockOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = {};
      
      if (status) {
        filter.status = status;
      }

      const stockOrders = await StockOrder.find(filter)
        .populate('supplier', 'businessName email')
        .populate('items.product', 'productName skuHandle')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Stock orders fetched successfully',
        data: stockOrders,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  getStockOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const stockOrder = await StockOrder.findById(id)
        .populate('supplier', 'businessName email contactFirstName contactLastName')
        .populate('items.product', 'productName skuHandle costPrice photo');

      if (!stockOrder) {
        return response.badReq(res, { message: 'Stock order not found' });
      }

      return response.ok(res, {
        message: 'Stock order fetched successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  updateStockOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

     
      if (updateData.items) {
        let totalAmount = 0;
        const orderItems = [];

        for (const item of updateData.items) {
          const product = await Product.findById(item.product);
          if (!product) {
            return response.badReq(res, { message: `Product not found: ${item.product}` });
          }

          const unitPrice = item.unitPrice || product.costPrice || 0;
          const totalPrice = unitPrice * item.quantity;
          totalAmount += totalPrice;

          orderItems.push({
            product: item.product,
            productName: product.productName,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
          });
        }

        updateData.items = orderItems;
        updateData.totalAmount = totalAmount;
      }

      const stockOrder = await StockOrder.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('supplier', 'businessName email');

      if (!stockOrder) {
        return response.badReq(res, { message: 'Stock order not found' });
      }

      return response.ok(res, {
        message: 'Stock order updated successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  sendStockOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      const stockOrder = await StockOrder.findByIdAndUpdate(
        id,
        {
          status: 'sent',
          sentAt: new Date(),
          sentTo: { email, name },
        },
        { new: true }
      );

      if (!stockOrder) {
        return response.badReq(res, { message: 'Stock order not found' });
      }

      
      // await sendOrderEmail(stockOrder, email, name);

      return response.ok(res, {
        message: 'Stock order sent successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  
  deleteStockOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const stockOrder = await StockOrder.findByIdAndDelete(id);

      if (!stockOrder) {
        return response.badReq(res, { message: 'Stock order not found' });
      }

      return response.ok(res, {
        message: 'Stock order deleted successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  receiveStockOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const stockOrder = await StockOrder.findById(id).populate('items.product');

      if (!stockOrder) {
        return response.badReq(res, { message: 'Stock order not found' });
      }

      if (stockOrder.status === 'received') {
        return response.badReq(res, { message: 'Order already received' });
      }

      for (const item of stockOrder.items) {
        const product = await Product.findById(item.product._id || item.product);
        
        if (product && product.trackStock && product.locations.length > 0) {
          product.locations[0].available += item.quantity;
          await product.save();
        }
      }

      stockOrder.status = 'received';
      stockOrder.receivedAt = new Date();
      await stockOrder.save();

      return response.ok(res, {
        message: 'Stock received and inventory updated successfully',
        data: stockOrder,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getProductsBySupplier: async (req, res) => {
    try {
      const { supplierId } = req.params;

      const products = await Product.find({
        primarySupplier: { $exists: true, $ne: '' },
      });

   
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return response.badReq(res, { message: 'Supplier not found' });
      }

      const supplierProducts = products.filter(
        (product) => product.primarySupplier === supplier.businessName
      );

      return response.ok(res, {
        message: 'Products fetched successfully',
        data: supplierProducts,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = stockOrderController;
