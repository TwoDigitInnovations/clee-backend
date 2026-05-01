const mongoose = require('mongoose');

const ServiceItemSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: { type: String, required: true },
    freq: { type: String, default: 'Every 2–3 weeks' },
    interval: { type: String, default: '7 days' },
    basePrice: { type: Number, required: true },
    commissionPct: { type: Number, default: 10, min: 0, max: 100 },
  },
  { _id: false },
);

const MarketingStepSchema = new mongoose.Schema(
  {
    id: { type: Number },
    icon: { type: String },
    title: { type: String, required: true },
    trigger: { type: String },
    badge: { type: String },
  },
  { _id: false },
);

const PersonalisedPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan_name: { type: String, required: true, trim: true },
    target_clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    services: { type: [ServiceItemSchema], default: [] },
    marketing_steps: { type: [MarketingStepSchema], default: [] },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'],
      default: 'draft',
    },
  },
  { timestamps: true },
);

PersonalisedPlanSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('PersonalisedPlan', PersonalisedPlanSchema);
