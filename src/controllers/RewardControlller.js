const Reward = require('@models/Rewards');
const response = require('../responses');

module.exports = {
  // ✅ CREATE
  createReward: async (req, res) => {
    try {
      const payload = req.body;
      payload.user = req.user.id;

      const data = await Reward.create(payload);

      return response.success(res, 'Reward created successfully', data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // ✅ GET ALL
  getAllRewards: async (req, res) => {
    try {
      const data = await Reward.find({ user: req.user.id })
        .populate('products.item')
        .populate('services.item')
        .sort({ createdAt: -1 });

      return response.success(res, 'Rewards fetched', data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // ✅ GET BY ID
  getRewardById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Reward.findOne({
        _id: id,
        user: req.user.id,
      })
        .populate('products.item')
        .populate('services.item');

      if (!data) return response.error(res, 'Reward not found');

      return response.success(res, 'Reward fetched', data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // ✅ UPDATE
  updateReward: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Reward.findOneAndUpdate(
        { _id: id, user: req.user.id },
        req.body,
        { new: true },
      );

      if (!data) return response.error(res, 'Reward not found');

      return response.success(res, 'Reward updated successfully', data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // ✅ DELETE
  deleteReward: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Reward.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

      if (!data) return response.error(res, 'Reward not found');

      return response.success(res, 'Reward deleted successfully');
    } catch (error) {
      return response.error(res, error.message);
    }
  },
};
