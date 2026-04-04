const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startHour: {
      type: Number,
      required: true,
    },
    durationMins: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Confirmed',
    },
    cancellationReason: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
