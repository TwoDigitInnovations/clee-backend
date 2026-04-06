const mongoose = require('mongoose');

const SpecificServiceSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    service_name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ['Visits', 'Hours', 'Minutes'],
      default: 'Visits',
    },
  },
  { _id: false },
);

const AnyServiceSchema = new mongoose.Schema(
  {
    quantity: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ['Visits', 'Hours', 'Minutes'],
      default: 'Visits',
    },
  },
  { _id: false },
);

const PackageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package_name: { type: String, required: true, trim: true },
    sku_handle: { type: String, trim: true, default: '' },
    tax_status: {
      type: String,
      enum: ['standard_15', 'standard_10', 'zero_0', 'exempt'],
      default: 'standard_15',
    },
    description: { type: String, default: '', maxlength: 1000 },
    cost_price: { type: Number, default: 0 },
    price: {
      type: Number,
      required: true,
    },
    price_includes_tax: { type: Boolean, default: false },

    redemption_starts: { type: Date, default: null },
    redemption_ends: { type: Date, default: null },
    expiry_date_reminder: { type: Boolean, default: false },

    // Photo
    photo: { type: String, default: null },

    // Package items
    package_item_type: {
      type: String,
      enum: ['specific', 'any'],
      default: 'specific',
    },
    specific_services: { type: [SpecificServiceSchema], default: [] },
    any_service_item: { type: AnyServiceSchema, default: null },

    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PackageSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Package', PackageSchema);
