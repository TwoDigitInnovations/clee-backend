const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    promo_name: {
      type: String,
      required: true,
      trim: true,
    },
    voucher_code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed", "free"],
      default: "percentage",
    },
    discount_value: {
      type: Number,
      default: 0,
    },
    tax_treatment: {
      type: String,
      enum: ["before", "after"],
      default: "before",
    },
    limit_per_customer: {
      type: Number,
      default: 1,
    },
    total_uses: {
      type: Number,
      default: null,
    },
    min_spend: {
      type: Number,
      default: 0,
    },
    validity_start: {
      type: Date,
      default: null,
    },
    validity_end: {
      type: Date,
      default: null,
    },
    appointment_date_start: {
      type: Date,
      default: null,
    },
    appointment_date_end: {
      type: Date,
      default: null,
    },
    applies_to_staff: {
      type: String,
      enum: ["all", "selected"],
      default: "all",
    },
    applies_to_customers: {
      type: String,
      enum: ["all", "vip", "selected"],
      default: "all",
    },
    selected_services: {
      type: [String],
      default: [],
    },
    combine_with_promos: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    used_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

PromoCodeSchema.set("toJSON", {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("PromoCode", PromoCodeSchema);