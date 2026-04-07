const GiftVoucher = require('@models/GiftVoucherTemplate');
const response = require('../responses');

module.exports = {

  createGiftVoucher: async (req, res) => {
    try {
      const payload = req.body;

      payload.user = req.user.id; 

      const data = await GiftVoucher.create(payload);
      console.log('data', data);
      return response.ok(res, {message : "Gift voucher created successfully", data});
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  getAllGiftVouchers: async (req, res) => {
    try {
      const data = await GiftVoucher.find({ user: req.user.id }).sort({ createdAt: -1 });

      return response.ok(res, {message : "Gift vouchers fetched", data});
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  getGiftVoucherById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await GiftVoucher.findOne({
        _id: id,
        user: req.user.id,
      });

      if (!data) return response.error(res, "Gift voucher not found");

      return response.success(res, "Gift voucher fetched", data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  updateGiftVoucher: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await GiftVoucher.findOneAndUpdate(
        { _id: id, user: req.user.id },
        req.body,
        { new: true }
      );

      if (!data) return response.error(res, "Gift voucher not found");

      return response.success(res, "Gift voucher updated successfully", data);
    } catch (error) {
      return response.error(res, error.message);
    }
  },

  // DELETE
  deleteGiftVoucher: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await GiftVoucher.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

      if (!data) return response.error(res, "Gift voucher not found");

      return response.success(res, "Gift voucher deleted successfully");
    } catch (error) {
      return response.error(res, error.message);
    }
  },
};
