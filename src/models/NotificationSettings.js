const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  staffNotifications: {
    appointmentEmail: {
      type: Boolean,
      default: true
    },
    appointmentSMS: {
      type: Boolean,
      default: false
    },
    onlineEmail: {
      type: Boolean,
      default: true
    },
    onlineSMS: {
      type: Boolean,
      default: false
    },
    staffMemberEmail: {
      type: Boolean,
      default: true
    },
    staffMemberSMS: {
      type: Boolean,
      default: false
    },
    emailAddress: {
      type: String,
      default: ''
    },
    countryCode: {
      type: String,
      default: '+61'
    },
    phoneNumber: {
      type: String,
      default: ''
    }
  },
  emailSettings: {
    additionalText: {
      type: String,
      default: ''
    },
    attachCalendar: {
      type: Boolean,
      default: true
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    bccEmail: {
      type: String,
      default: ''
    },
    replyEmail: {
      type: String,
      default: ''
    },
    receiveCustomerCopy: {
      type: Boolean,
      default: false
    },
    receiveStaffCopy: {
      type: Boolean,
      default: false
    }
  },
  smsSettings: {
    twoWaySMS: {
      type: Boolean,
      default: true
    },
    confirmPencilled: {
      type: Boolean,
      default: true
    },
    makePencilledDefault: {
      type: Boolean,
      default: false
    },
    sendConfirmationSMS: {
      type: Boolean,
      default: true
    },
    startTime: {
      type: String,
      default: '09:00 AM'
    },
    stopTime: {
      type: String,
      default: '09:00 PM'
    },
    notificationDelay: {
      type: String,
      default: 'Default (10 minutes)'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
