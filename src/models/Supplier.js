const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  physicalAddress1: { type: String, default: '' },
  physicalAddress2: { type: String, default: '' },
  physicalCity: { type: String, default: '' },
  physicalState: { type: String, default: '' },
  physicalPostcode: { type: String, default: '' },
  postalAddress1: { type: String, default: '' },
  postalAddress2: { type: String, default: '' },
  postalCity: { type: String, default: '' },
  postalState: { type: String, default: '' },
  postalPostcode: { type: String, default: '' },
});

const supplierSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    customerId: {
      type: String,
      trim: true,
    },
    contactFirstName: {
      type: String,
      trim: true,
    },
    contactLastName: {
      type: String,
      trim: true,
    },
    telephone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    addresses: [addressSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
