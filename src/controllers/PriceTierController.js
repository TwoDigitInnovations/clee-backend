const PriceTier = require('../models/PriceTier');
const User = require('../models/User');
const response = require('../responses');

const priceTierController = {
  createPriceTier: async (req, res) => {
    try {
      const payload = req.body;

      // ✅ Check array
      if (!Array.isArray(payload) || payload.length === 0) {
        return response.badReq(res, { message: 'Payload must be an array' });
      }

      // ✅ Collect all staff ids from all tiers
      const allStaffIds = payload.flatMap(
        (tier) => tier.assignedStaffIds || [],
      );

      // 🔍 Validate staff
      if (allStaffIds.length > 0) {
        const validStaff = await User.find({
          _id: { $in: allStaffIds },
        });

        if (validStaff.length !== new Set(allStaffIds).size) {
          return response.badReq(res, { message: 'Invalid staff selected' });
        }
      }

      // ✅ Prepare data
      const tiersToCreate = payload.map((tier) => ({
        name: tier.name,
        assignedStaffIds: tier.assignedStaffIds || [],
      }));

      // ✅ Insert many
      const createdTiers = await PriceTier.insertMany(tiersToCreate);

      return response.ok(res, {
        message: 'Price tiers created successfully',
        data: createdTiers,
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
