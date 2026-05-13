const mongoose = require('mongoose');

const freeTrialSetupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    providerType: { type: String },
    businessName: { type: String },
    displayName: { type: String },
    bio: { type: String },
    website: { type: String },
    instagram: { type: String },
    logo: { type: String },

    primaryColor: { type: String, default: '#006874' },
    accentColor: { type: String, default: '#26CCDA' },
    streetAddress: { type: String },
    suburb: { type: String },
    state: { type: String },
    postcode: { type: String },
    businessPhone: { type: String },
    bookingEmail: { type: String },

    serviceCategories: [{ type: String }],

    services: [
      {
        name: { type: String },
        price: { type: Number },
        durationMins: { type: Number },
        depositType: { type: String },
        depositAmount: { type: String },
      },
    ],

    staff: [
      {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        role: { type: String },
        specialty: { type: String },
      },
    ],

    openingHours: { type: Object },

    bookingSettings: {
      minNotice: { type: String },
      advanceBooking: { type: String },
      cancellationPolicy: { type: String },
    },

    selectedPlan: { type: String, default: 'growth' },

    payoutAccountName: { type: String },
    payoutAbn: { type: String },
    payoutBsb: { type: String },
    payoutAccountNumber: { type: String },

    completedSteps: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FreeTrialSetup', freeTrialSetupSchema);
