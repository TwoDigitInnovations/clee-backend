const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Please enter a valid email address',
      ],
    },
    address: {
      type: Object,
    },
    hours: {
      type: Object,
    },
    service_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    phone: {
      type: String,
    },
    CustomerId: {
      type: String,
    },
    SalonManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    employee_type: String,
    book_online: String,
    profile_booking: String,
    notification: String,
    telephone: String,
    mobile: String,
    occupation: String,
    customer_type: {
      type: String,
      default: 'New',
    },
    nickName: String,
    jobTitle: String,
    referenceType: String,
    referenceNumber: String,
    bio: String,
    customMessage: String,
    syncCalendar: Boolean,

    physical_address: {
      physical_address: String,
      physical_suburb: String,
      physical_city: String,
      physical_state: String,
      physical_postcode: String,
    },

    postal_address: {
      postal_address: String,
      postal_suburb: String,
      postal_city: String,
      postal_state: String,
      postal_postcode: String,
    },

    gender: String,
    dob: Date,
    referred_by: String,
    timezone: {
      type: String,
      default: '(GMT-08:00) Pacific Time',
    },

    alerts: String,
    is_active: {
      type: Boolean,
      default: true,
    },
    no_shows: {
      type: Number,
      default: 0,
    },

    card_number: String,
    card_expiry: String,
    card_cvc: String,
    save_card: Boolean,

    booking_change_email: Boolean,
    booking_change_sms: Boolean,
    followup_email: Boolean,
    rebooking_reminder: Boolean,
    email_reminder: String,
    sms_reminder: String,
    sms_marketing: Boolean,
    AetherGlobalCommision: Number,
    VanguardHoldingsCommision: Number,

    SolsticeRealEstateCommision: Number,
    isBlocked: {
      type: Boolean,
      default: false,
    },

    photo: String,
    business: {
      name: {
        type: String,
        trim: true,
      },
      logo: String,

      category: String,

      description: String,

      website: {
        protocol: String,
        url: String,
      },

      socialLinks: {
        twitter: String,
        instagram: String,
        facebookPage: String,
      },

      settings: {
        updateBilling: {
          type: Boolean,
          default: false,
        },
        country: {
          type: String,
          default: 'Australia',
        },
        currency: String,
        dateFormat: String,
        timeFormat: String,
      },
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'superadmin', 'staff'],
      default: 'user',
    },

    status: {
      type: String,
      default: 'Pending',
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

userSchema.methods.isPasswordMatch = async function (password) {
  return password === this.password;
};

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
