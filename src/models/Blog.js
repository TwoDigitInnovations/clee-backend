const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String },
    image: { type: String },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const blogHeroSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'The Future of Holistic Wellness' },
    subtitle: { type: String, default: 'Integration Tech and Tranquility' },
    description: { type: String, default: 'Discover how cutting-edge technology is transforming the wellness industry while maintaining the human touch that matters most.' },
    image: { type: String, default: '' },
    buttonText: { type: String, default: 'Read More' },
  },
  { timestamps: true }
);

module.exports = {
  Blog: mongoose.model('Blog', blogSchema),
  BlogHero: mongoose.model('BlogHero', blogHeroSchema),
};
