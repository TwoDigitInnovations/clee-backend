const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },

    // ✅ Pricing
    priceType: {
      type: String,
      enum: ['Fixed price', 'Free', 'Variable', 'Custom'],
      default: 'Fixed price',
    },

    price: {
      type: Number,
      default: 0,
    },

    priceIncludesTax: {
      type: Boolean,
      default: true,
    },

    pricetier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'pricetier',
    },

    
    duration: {
      type: Number, // total minutes
    },

  
    tax: {
      type: String,
      default: 'GST',
    },

    // ✅ Staff
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // ✅ UI Related
    color: String,

    // ✅ Booking Settings
    onlineBookings: {
      type: Boolean,
      default: true,
    },

    vipOnly: {
      type: Boolean,
      default: false,
    },

    isVideoCall: {
      type: Boolean,
      default: false,
    },

    pancakePricing: [
      {
        name: String,
        services: [String],
        combinedPrice: String,
        mostPopular: Boolean,
      },
    ],

    availableAddons: [
      {
        name: String,
        duration: String,
        price: String,
      },
    ],

    bookingQuestion: String,
    
    bookingQuestionRequired: {
      type: String,
      enum: ['Online and via calendar', 'Online only', 'Calendar only', 'Not required'],
      default: 'Online and via calendar',
    },

    depositType: String,
    depositPercentage: Number,
    depositAmount: Number,

    paymentPolicy: {
      type: String,
      default: 'default',
    },

    onlinePayment: {
      type: String,
      default: 'default',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
