const Reward = require('@models/Rewards');
const response = require('../responses');

module.exports = {
  getAllRewards: async (req, res) => {
    try {
      const data = await Reward.find({ user: req.user.id })
        .populate('products.item')
        .populate('services.item')
        .sort({ createdAt: -1 });

      return response.ok(res, { message: 'Rewards fetched', data: data });
    } catch (error) {
      return response.error(res, error.message);
    }
  },

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

      return response.ok(res, { message: 'Reward fetched', data: data });
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // ✅ UPDATE
  createOrUpdateReward: async (req, res) => {
    try {
      const payload = req.body;

      const data = await Reward.findOneAndUpdate(
        { user: req.user.id }, // 👈 unique per user
        payload,
        {
          returnDocument: 'after',
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
      console.log(data);
      return response.ok(res, {
        message: 'Reward settings saved successfully',
        data: data,
      });
    } catch (error) {
      response.error(res, error.message);
      console.log(error.message);
      return;
    }
  },

  deleteReward: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Reward.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

      if (!data) return response.error(res, 'Reward not found');

      return response.ok(res, {
        message: 'Reward deleted successfully',
        data: data,
      });
    } catch (error) {
      return response.error(res, error.message);
    }
  },
};
