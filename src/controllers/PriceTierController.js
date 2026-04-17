const PriceTier = require('../models/PriceTier');
const User = require('../models/User');
const response = require('../responses');

const priceTierController = {
  createOrUpdatePriceTier: async (req, res) => {
    try {
      const payload = req.body;
      const userId = req.user.id; // 👈 login user
      if (!Array.isArray(payload) || payload.length === 0) {
        return response.badReq(res, { message: 'Payload must be an array' });
      }

      const allStaffIds = payload.flatMap(
        (tier) => tier.assignedStaffIds || [],
      );

      if (allStaffIds.length > 0) {
        const validStaff = await User.find({
          _id: { $in: allStaffIds },
        });

        if (validStaff.length !== new Set(allStaffIds).size) {
          return response.badReq(res, { message: 'Invalid staff selected' });
        }
      }

      const toUpdate = payload.filter((t) => t._id);
      const toCreate = payload.filter((t) => !t._id);

      let updatedTiers = [];
      let createdTiers = [];

      for (const tier of toUpdate) {
        const updated = await PriceTier.findByIdAndUpdate(
          { _id: tier._id, user: req.user.id },
          {
            name: tier.name,
            assignedStaffIds: tier.assignedStaffIds || [],
          },
          { new: true },
        );

        if (updated) updatedTiers.push(updated);
      }

      if (toCreate.length > 0) {
        createdTiers = await PriceTier.insertMany(
          toCreate.map((tier) => ({
            name: tier.name,
            assignedStaffIds: tier.assignedStaffIds || [],
            user: userId,
          })),
        );
      }

      const incomingIds = [
        ...toUpdate.map((t) => t._id),
        ...createdTiers.map((t) => t._id),
      ];
      await PriceTier.deleteMany({
        user: userId, // 👈 ADD THIS
        _id: { $nin: incomingIds },
      });

      return response.ok(res, {
        message: 'Price tiers synced successfully',
        data: [...updatedTiers, ...createdTiers],
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPriceTiers: async (req, res) => {
    try {
      const tiers = await PriceTier.find({ user: req.user.id }).populate(
        'assignedStaffIds',
      );

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

      const tier = await PriceTier.findById({
        _id: id,
        user: req.user.id,
      }).populate('assignedStaffIds');

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

      const deleted = await PriceTier.findByIdAndDelete({
        _id: id,
        user: req.user.id,
      });

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
