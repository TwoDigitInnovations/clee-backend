const Discount = require('@models/Discounts');
const response = require('../responses');

module.exports = {

  createDiscount: async (req, res) => {
    try {
      const payload = req.body;
      const userId = req.user.id;

      if (!payload.name) {
        return response.badReq(res, { message: 'Name is required' });
      }

      const discount = await Discount.create({ ...payload, user: userId });

      return response.ok(res, {
        message: 'Discount created successfully',
        data: discount,
      });
    } catch (err) {
      return response.error(res, err);
    }
  },

  getAllDiscounts: async (req, res) => {
    try {
      const userId = req.user.id;
      const discounts = await Discount.find({ user: userId }).sort({
        createdAt: -1,
      });

      return response.ok(res, {
        data: discounts,
      });
    } catch (err) {
      return response.error(res, err);
    }
  },

  getDiscountById: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await Discount.findById(id);

      if (!discount) {
        return response.badReq(res, { message: 'Discount not found' });
      }

      return response.ok(res, { data: discount });
    } catch (err) {
      return response.error(res, err);
    }
  },

  updateDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const userId = req.user.id;

      const updated = await Discount.findByIdAndUpdate(
        id,
        { ...payload, user: userId },
        {
          new: true,
        },
      );

      if (!updated) {
        return response.badReq(res, { message: 'Discount not found' });
      }

      return response.ok(res, {
        message: 'Discount updated successfully',
        data: updated,
      });
    } catch (err) {
      return response.error(res, err);
    }
  },

  deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = await Discount.findOneAndDelete({
        _id: id,
        user: userId,
      });

      if (!deleted) {
        return response.badReq(res, { message: 'Discount not found' });
      }

      return response.ok(res, {
        message: 'Discount deleted successfully',
      });
    } catch (err) {
      return response.error(res, err);
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await Discount.findById(id);

      if (!discount) {
        return response.badReq(res, { message: 'Discount not found' });
      }

      discount.isActive = !discount.isActive;
      await discount.save();

      return response.ok(res, {
        message: 'Status updated',
        data: discount,
      });
    } catch (err) {
      return response.error(res, err);
    }
  },
};
