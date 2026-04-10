const mongoose = require('mongoose');

const TemplateLibrarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    templateType: {
      type: String,
      enum: ['custom', 'industry', 'expert'],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },

    items: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

TemplateLibrarySchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('TemplateLibrary', TemplateLibrarySchema);
