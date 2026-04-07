const mongoose = require('mongoose');

const giftVoucherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    GiftVoucher_name: {
      type: String,
      default: '',
    },
    sku_handle: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    tax_status: {
      type: String,
      default: 'taxable',
    },
    cost_price: {
      type: Number,
      default: '',
    },
    price: {
      type: Number,
      default: '',
    },
    price_includes_tax: {
      type: Boolean,
      default: false,
    },
    selected_template: {
      type: String,
      default: 'signature_atelier',
    },
    custom_amount_online: {
      type: Boolean,
      default: true,
    },
    expiry_type: {
      type: String,
      default: 'after',
    },
    expiry_value: {
      type: Number,
      default: 12,
    },
    expiry_unit: {
      type: String,
      default: 'Months',
    },
    terms_template: {
      type: String,
      default: 'default',
    },
    termsValue: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

giftVoucherSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('GiftVoucher', giftVoucherSchema);

