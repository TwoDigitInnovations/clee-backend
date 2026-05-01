const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  otherPhone: String
}, { _id: false });

const waitlistSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    service: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
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
      required: false,
    },
  },
  { timestamps: true, strict: false },
);

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

module.exports = Waitlist;
