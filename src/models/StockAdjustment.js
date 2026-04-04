const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    location: String,
    adjustmentType: {
      type: String,
      enum: ['set', 'add', 'reduce'],
      required: true,
    },
    previousAmount: Number,
    newAmount: Number,
    changeAmount: Number,
    reason: {
      type: String,
      enum: ['new-stock', 'return', 'transfer', 'adjustment', 'other'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
