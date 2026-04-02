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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],

    allowOnlineBooking: {
      type: Boolean,
      default: true,
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
