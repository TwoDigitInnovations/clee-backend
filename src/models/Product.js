const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['retail', 'professional'],
      required: true,
    },
    skuHandle: {
      type: String,
      unique: true,
      sparse: true,
    },
    barcode: String,
    description: String,
    costPrice: {
      type: Number,
      default: 0,
    },
    retailPrice: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: String,
      default: 'Standard (20%)',
    },
    priceIncludesTax: {
      type: Boolean,
      default: false,
    },
    primarySupplier: String,
    supplierProductCode: String,
    trackStock: {
      type: Boolean,
      default: true,
    },
    allowOutOfStock: {
      type: Boolean,
      default: false,
    },
    sendAlertEmails: {
      type: Boolean,
      default: false,
    },
    locations: [
      {
        name: String,
        available: {
          type: Number,
          default: 0,
        },
        alert: Number,
        ideal: Number,
      },
    ],
    photo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
