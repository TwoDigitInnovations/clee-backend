const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location_name: {
      type: String,
      required: true,
      trim: true,
    },

    telephone: String,

    location_type: {
      type: String,
      enum: ["fixed", "mobile"],
      default: "fixed",
    },

    book_online: {
      type: Boolean,
      default: false,
    },

    address: {
      street: String,
      apartment: String,
      suburb: String,
      city: String,
      state: String,
      postal_code: String,
    },

    hours: {
      Monday: { enabled: Boolean, open: String, close: String },
      Tuesday: { enabled: Boolean, open: String, close: String },
      Wednesday: { enabled: Boolean, open: String, close: String },
      Thursday: { enabled: Boolean, open: String, close: String },
      Friday: { enabled: Boolean, open: String, close: String },
      Saturday: { enabled: Boolean, open: String, close: String },
      Sunday: { enabled: Boolean, open: String, close: String },
    },
  },
  { timestamps: true }
);

locationSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Location", locationSchema);
