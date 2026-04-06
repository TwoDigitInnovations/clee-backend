const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tax: {
      type: String,
      enum: ['GST', 'Not Applicable'],
      default: 'Not Applicable',
    },

    discountType: {
      type: String,
      enum: ['generic', 'percentage', 'fixed'],
      required: true,
    },

    value: {
      type: Number,
      default: 0,
    },

    isGeneric: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

discountSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Discount', discountSchema);
