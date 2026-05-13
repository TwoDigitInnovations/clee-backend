const mongoose = require('mongoose');

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const faqCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  order: { type: Number, default: 0 },
  items: [faqItemSchema],
});

const faqSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['faq_page', 'consult_section'],
      required: true,
      unique: true,
    },
    categories: [faqCategorySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('FAQ', faqSchema);
