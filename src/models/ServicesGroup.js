const mongoose = require('mongoose');

const serviceGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
          required: true,
        },
        name: String,
        duration: String,
        paddingBefore: String,
        paddingAfter: String,
        cost: String,
        overridePrice: Boolean,
      },
    ],

    allowOnlineBooking: {
      type: Boolean,
      default: true,
    },
    paymentPolicy: {
      type: String,
    },
    differentPolicyType: {
      type: String,
    },
  },
  { timestamps: true },
);

serviceGroupSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('ServiceGroup', serviceGroupSchema);
