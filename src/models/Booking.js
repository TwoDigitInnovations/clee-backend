const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    service: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    }],
    services: [{
      type: mongoose.Schema.Types.Mixed,
    }],
    extras: [{
      type: mongoose.Schema.Types.Mixed,
    }],
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    startHour: {
      type: Number,
      required: false,
    },
    durationMins: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed', 'pending'],
      default: 'Pending',
    },
    cancellationReason: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online'],
      default: 'cash',
    },
    notes: {
      type: String,
    },
    comments: {
      type: String,
    },
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    history: [
      {
        type: {
          type: String,
          enum: ['alert', 'amended'],
          default: 'amended',
        },
        date: {
          type: String,
        },
        message: {
          type: String,
        },
        changedBy: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
