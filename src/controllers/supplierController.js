const Supplier = require('../models/Supplier');
const response = require('../responses');

const supplierController = {
  
  createSupplier: async (req, res) => {
    try {
      const supplierData = req.body;

      const supplier = await Supplier.create(supplierData);

      return response.ok(res, {
        message: 'Supplier created successfully',
        data: supplier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  
  getAllSuppliers: async (req, res) => {
    try {
      const { isActive } = req.query;
      const filter = {};
      
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Suppliers fetched successfully',
        data: suppliers,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findById(id);

      if (!supplier) {
        return response.badReq(res, { message: 'Supplier not found' });
      }

      return response.ok(res, {
        message: 'Supplier fetched successfully',
        data: supplier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  
  updateSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!supplier) {
        return response.badReq(res, { message: 'Supplier not found' });
      }

      return response.ok(res, {
        message: 'Supplier updated successfully',
        data: supplier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByIdAndDelete(id);

      if (!supplier) {
        return response.badReq(res, { message: 'Supplier not found' });
      }

      return response.ok(res, {
        message: 'Supplier deleted successfully',
        data: supplier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = supplierController;
