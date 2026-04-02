const mongoose = require('mongoose');

const priceTierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    assignedStaffIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceTier', priceTierSchema);
