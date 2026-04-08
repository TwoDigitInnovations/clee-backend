const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['customer-reminder', 'follow-up', 'rebooking-reminder', 'did-not-show', 'booking-changes', 'appointment-pencilled']
  },
  channel: {
    type: String,
    required: true,
    enum: ['SMS', 'Email']
  },
  timing: {
    type: String,
    required: true,
    default: '24 hours after'
  },
  appointmentStatus: {
    type: String,
    default: 'Not started'
  },
  serviceType: {
    type: String,
    enum: ['any', 'selected'],
    default: 'any'
  },
  selectedServices: [{
    type: String
  }],
  futureAppointmentType: {
    type: String,
    enum: ['any', 'selected'],
    default: 'any'
  },
  selectedFutureServices: [{
    type: String
  }],
  sendWithStatus: {
    type: Boolean,
    default: true
  },
  sendNoPrevious: {
    type: Boolean,
    default: false
  },
  sendOnlyOnce: {
    type: Boolean,
    default: false
  },
  messageText: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
