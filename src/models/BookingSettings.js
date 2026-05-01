const mongoose = require('mongoose');

const bookingSettingsSchema = new mongoose.Schema(
  {
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bookingsOn: {
      type: Boolean,
      default: true,
    },
    initialStatus: {
      type: String,
      enum: ['confirmed', 'pencilled-in'],
      default: 'confirmed',
    },
    staffSelection: {
      type: String,
      default: 'Clients can choose any staff',
    },
    clientDataReq: {
      type: Boolean,
      default: false,
    },
    multiServiceBooking: {
      type: Boolean,
      default: true,
    },
    multipleServices: {
      type: Boolean,
      default: false,
    },
    multipleStaff: {
      type: Boolean,
      default: true,
    },
    allowTimezone: {
      type: Boolean,
      default: true,
    },
    calendarMode: {
      type: String,
      enum: ['all', 'minimise', 'intervals'],
      default: 'minimise',
    },
    loginMode: {
      type: String,
      enum: ['either', 'must', 'hide'],
      default: 'either',
    },
    hideVIP: {
      type: Boolean,
      default: false,
    },
    loginMessage: {
      type: String,
      default: '',
    },
    leadTime: {
      type: String,
      default: '0 hours',
    },
    futureMonths: {
      type: String,
      default: '12',
    },
    futureUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'months',
    },
    cancelWindow: {
      type: String,
      default: '24 hours',
    },
    portalTheme: {
      type: String,
      enum: ['clee', 'neutral', 'custom'],
      default: 'custom',
    },
    btnColor: {
      type: String,
      default: '#434C',
    },
    btnText: {
      type: String,
      default: '#FFFFFF',
    },
    linkColor: {
      type: String,
      default: '#4D3D',
    },
    selectServiceText: {
      type: String,
      default: '',
    },
    selectStaffText: {
      type: String,
      default: '',
    },
    selectDateText: {
      type: String,
      default: '',
    },
    enterDetailsText: {
      type: String,
      default: '',
    },
    apptConfirmedText: {
      type: String,
      default: '',
    },
    noServiceText: {
      type: String,
      default: '',
    },
    privacyPolicy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const BookingSettings = mongoose.model('BookingSettings', bookingSettingsSchema);

module.exports = BookingSettings;
