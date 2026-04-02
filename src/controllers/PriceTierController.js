const PriceTier = require('../models/PriceTier');
const User = require('../models/User');
const response = require('../responses');


const priceTierController = {
  createPriceTier: async (req, res) => {
    try {
      const { name, assignedStaffIds } = req.body;

      if (!name) {
        return response.badReq(res, { message: 'Tier name is required' });
      }

      if (assignedStaffIds?.length) {
        const validStaff = await User.find({
          _id: { $in: assignedStaffIds },
        });

        if (validStaff.length !== assignedStaffIds.length) {
          return response.badReq(res, { message: 'Invalid staff selected' });
        }
      }

      const tier = await PriceTier.create({
        name,
        assignedStaffIds,
      });

      return response.ok(res, {
        message: 'Price tier created successfully',
        data: tier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPriceTiers: async (req, res) => {
    try {
      const tiers = await PriceTier.find().populate('assignedStaffIds');

      return response.ok(res, {
        message: 'Price tiers fetched successfully',
        data: tiers,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getPriceTierById: async (req, res) => {
    try {
      const { id } = req.params;

      const tier = await PriceTier.findById(id).populate('assignedStaffIds');

      if (!tier) {
        return response.badReq(res, { message: 'Price tier not found' });
      }

      return response.ok(res, {
        message: 'Price tier fetched successfully',
        data: tier,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updatePriceTier: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, assignedStaffIds } = req.body;

      if (assignedStaffIds?.length) {
        const validStaff = await User.find({
          _id: { $in: assignedStaffIds },
        });

        if (validStaff.length !== assignedStaffIds.length) {
          return response.badReq(res, { message: 'Invalid staff selected' });
        }
      }

      const updated = await PriceTier.findByIdAndUpdate(
        id,
        { name, assignedStaffIds },
        { new: true },
      );

      if (!updated) {
        return response.badReq(res, { message: 'Price tier not found' });
      }

      return response.ok(res, {
        message: 'Price tier updated successfully',
        data: updated,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deletePriceTier: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await PriceTier.findByIdAndDelete(id);

      if (!deleted) {
        return response.badReq(res, { message: 'Price tier not found' });
      }

      return response.ok(res, {
        message: 'Price tier deleted successfully',
        data: deleted,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = priceTierController;
