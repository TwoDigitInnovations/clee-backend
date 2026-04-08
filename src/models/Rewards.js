const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    rewardsActive: {
      type: Boolean,
      default: true,
    },

    selectedPreset: {
      type: String,
      default: '', // e.g. "standard", "premium"
    },

    customSpend: {
      type: Number,
      default: 0,
    },

    customReward: {
      type: Number,
      default: 0,
    },

    products: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        spend: Number,
        reward: Number,
      },
    ],

    services: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
        },
        spend: Number,
        reward: Number,
      },
    ],

    neverExpire: {
      type: Boolean,
      default: false,
    },

    expiryYears: {
      type: Number,
      default: 1,
    },

    applyExisting: {
      type: Boolean,
      default: false,
    },

    showToCustomers: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Reward', rewardSchema);
