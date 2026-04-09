const mongoose = require('mongoose');

const automationRulesSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    selectedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    addAllServices: {
      type: Boolean,
      default: false,
    },

    whenToSend: {
      type: String,
      enum: ['reminder', 'after', 'before'],
      default: 'reminder',
    },

    viaEmail: {
      type: Boolean,
      default: true,
    },

    viaSMS: {
      type: Boolean,
      default: true,
    },

    newClientsOnly: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true },
);

automationRulesSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('automationRules', automationRulesSchema);
