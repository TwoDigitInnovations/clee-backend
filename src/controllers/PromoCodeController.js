const PromoCode = require('@models/PromoCode');
const response = require('../responses');

module.exports = {
  createPromoCode: async (req, res) => {
    try {
      const userId = req.user.id;

      const exists = await PromoCode.findOne({
        user: userId,
        voucher_code: req.body.voucher_code?.toUpperCase(),
      });
      if (exists) {
        return response.error(res, {
          message: 'Voucher code already exists. Please use a different code.',
        });
      }

      const promoCode = await PromoCode.create({
        ...req.body,
        voucher_code: req.body.voucher_code?.toUpperCase(),
        user: userId,
      });

      return response.ok(res, {
        message: 'Promo code created successfully',
        data: promoCode,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPromoCodes: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, search, discount_type } = req.query;

      const filter = { user: userId };

      if (status !== undefined) filter.status = status === 'true';
      if (discount_type) filter.discount_type = discount_type;
      if (search) {
        filter.$or = [
          { promo_name: { $regex: search, $options: 'i' } },
          { voucher_code: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [promoCodes, total] = await Promise.all([
        PromoCode.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        PromoCode.countDocuments(filter),
      ]);

      return response.ok(res, {
        message: 'Promo codes fetched successfully',
        data: {
          promoCodes,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getPromoCode: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const promoCode = await PromoCode.findOne({ _id: id, user: userId });
      if (!promoCode) {
        return response.error(res, { message: 'Promo code not found' });
      }

      return response.ok(res, {
        message: 'Promo code fetched successfully',
        data: promoCode,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updatePromoCode: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // If voucher_code is being changed, check uniqueness
      if (req.body.voucher_code) {
        const exists = await PromoCode.findOne({
          user: userId,
          voucher_code: req.body.voucher_code.toUpperCase(),
          _id: { $ne: id },
        });
        if (exists) {
          return response.error(res, {
            message:
              'Voucher code already exists. Please use a different code.',
          });
        }
        req.body.voucher_code = req.body.voucher_code.toUpperCase();
      }

      const promoCode = await PromoCode.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: req.body },
        { new: true, runValidators: true },
      );

      if (!promoCode) {
        return response.error(res, { message: 'Promo code not found' });
      }

      return response.ok(res, {
        message: 'Promo code updated successfully',
        data: promoCode,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deletePromoCode: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const promoCode = await PromoCode.findOneAndDelete({
        _id: id,
        user: userId,
      });

      if (!promoCode) {
        return response.error(res, { message: 'Promo code not found' });
      }

      return response.ok(res, {
        message: 'Promo code deleted successfully',
        data: null,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const promoCode = await PromoCode.findOne({ _id: id, user: userId });
      if (!promoCode) {
        return response.error(res, { message: 'Promo code not found' });
      }

      promoCode.status = !promoCode.status;
      await promoCode.save();

      return response.ok(res, {
        message: `Promo code ${promoCode.status ? 'activated' : 'deactivated'} successfully`,
        data: promoCode,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  validatePromoCode: async (req, res) => {
    try {
      const { voucher_code, service, spend_amount } = req.body;

      const promoCode = await PromoCode.findOne({
        voucher_code: voucher_code?.toUpperCase(),
        status: true,
      });

      if (!promoCode) {
        return response.error(res, {
          message: 'Invalid or expired promo code',
        });
      }

      const now = new Date();

      // Validity date check
      if (promoCode.validity_start && now < promoCode.validity_start) {
        return response.error(res, { message: 'Promo code is not yet active' });
      }
      if (promoCode.validity_end && now > promoCode.validity_end) {
        return response.error(res, { message: 'Promo code has expired' });
      }

      // Total uses check
      if (
        promoCode.total_uses !== null &&
        promoCode.used_count >= promoCode.total_uses
      ) {
        return response.error(res, {
          message: 'Promo code usage limit reached',
        });
      }

      // Min spend check
      if (spend_amount !== undefined && spend_amount < promoCode.min_spend) {
        return response.error(res, {
          message: `Minimum spend of $${promoCode.min_spend} required`,
        });
      }

      // Service check
      if (
        service &&
        promoCode.selected_services.length > 0 &&
        !promoCode.selected_services.includes(service)
      ) {
        return response.error(res, {
          message: 'Promo code is not valid for this service',
        });
      }

      return response.ok(res, {
        message: 'Promo code is valid',
        data: {
          promo_name: promoCode.promo_name,
          discount_type: promoCode.discount_type,
          discount_value: promoCode.discount_value,
          combine_with_promos: promoCode.combine_with_promos,
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
