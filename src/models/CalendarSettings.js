const mongoose = require('mongoose');

const calendarSettingsSchema = new mongoose.Schema(
  {
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
   
    displaySettings: {
      startOfWeek: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        default: 'Sunday',
      },
      calendarStartTime: {
        type: String,
        default: '9:00',
      },
      timeIncrement: {
        type: String,
        enum: ['5 minutes', '10 minutes', '15 minutes', '30 minutes', '60 minutes'],
        default: '5 minutes',
      },
      highContrastMode: {
        type: Boolean,
        default: false,
      },
      displayPaddingTimes: {
        type: Boolean,
        default: false,
      },
    },
    
    appointmentSettings: {
      initialStatus: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Not started'],
        default: 'Confirmed',
      },
      addCompanyName: {
        type: Boolean,
        default: false,
      },
      keepPaddingTimes: {
        type: Boolean,
        default: false,
      },
      allowDelete: {
        type: Boolean,
        default: false,
      },
    },
  
    inclusionSettings: {
      capturePronouns: {
        type: Boolean,
        default: false,
      },
      displayPronouns: {
        type: Boolean,
        default: false,
      },
    },
  
    covidVaccinationPolicy: {
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    
    dailySummary: {
      enabled: {
        type: Boolean,
        default: false,
      },
    },
  
    cancellationReasons: {
      type: [String],
      default: [
        'Other',
        'Wasn\'t due To Business/ Wasn\'t For Discount',
        'Sickness',
        'Appointment Made In Error',
        'Lorem Ipsum on This Will Refund',
      ],
    },
    
    appointmentStatuses: [
      {
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        enabled: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);


calendarSettingsSchema.pre('save', function () {
  if (this.isNew && (!this.appointmentStatuses || this.appointmentStatuses.length === 0)) {
    this.appointmentStatuses = [
      { name: 'Not started', color: 'bg-gray-400', enabled: false },
      { name: 'Arrived', color: 'bg-purple-500', enabled: false },
      { name: 'Started', color: 'bg-gray-400', enabled: false },
      { name: 'Completed', color: 'bg-gray-400', enabled: false },
      { name: 'Did not show', color: 'bg-red-500', enabled: false },
    ];
  }
});

const CalendarSettings = mongoose.model('CalendarSettings', calendarSettingsSchema);

module.exports = CalendarSettings;
