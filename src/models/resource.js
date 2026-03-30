const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    resource_name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Resource', resourceSchema);
