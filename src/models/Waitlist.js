const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: [{
      type: String,
      required: true,
    }],
    notes: {
      type: String,
      default: 'No notes',
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    preferredDate: {
      type: Date,
    },
    preferredTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Active', 'Scheduled', 'Cancelled'],
      default: 'Active',
    },
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

module.exports = Waitlist;
