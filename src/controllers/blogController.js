const { Blog, BlogHero } = require('@models/Blog');
const response = require('../responses');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let count = 0;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Blog.findOne(query);
    if (!existing) break;
    count++;
    slug = `${baseSlug}-${count}`;
  }
  return slug;
};

const formatHistoryDate = () => {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

module.exports = {
  getAllBlogs: async (req, res) => {
    try {
      const { category, status } = req.query;
      const filter = {};
      if (category && category !== 'All Articles') filter.category = category;
      if (status) filter.status = status;
      const blogs = await Blog.find(filter).sort({ createdAt: -1 });
      return response.ok(res, { data: blogs });
    } catch (err) {
      return response.error(res, err);
    }
  },

  getBlogById: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return response.notFound(res, { message: 'Blog not found' });
      return response.ok(res, { data: blog });
    } catch (err) {
      return response.error(res, err);
    }
  },

  getBlogBySlug: async (req, res) => {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
      if (!blog) return response.notFound(res, { message: 'Blog not found' });
      return response.ok(res, { data: blog });
    } catch (err) {
      return response.error(res, err);
    }
  },

  createBlog: async (req, res) => {
    try {
      const { title, excerpt, content, category, status } = req.body;
      const image = req.file?.path || req.file?.location || req.body.image || '';

      const baseSlug = generateSlug(title);
      const slug = await ensureUniqueSlug(baseSlug);

      const blog = await Blog.create({
        title, slug, excerpt, content, image, category,
        status: status || 'published',
        createdBy: req.user?.id,
      });
      return response.ok(res, { message: 'Blog created successfully', data: blog });
    } catch (err) {
      return response.error(res, err);
    }
  },

  updateBlog: async (req, res) => {
    try {
      const { title, excerpt, content, category, status } = req.body;
      const updateData = { title, excerpt, content, category, status };

      if (title) {
        const baseSlug = generateSlug(title);
        updateData.slug = await ensureUniqueSlug(baseSlug, req.params.id);
      }

      if (req.file?.path || req.file?.location) updateData.image = req.file.path || req.file.location;
      else if (req.body.image) updateData.image = req.body.image;

      const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!blog) return response.notFound(res, { message: 'Blog not found' });
      return response.ok(res, { message: 'Blog updated successfully', data: blog });
    } catch (err) {
      return response.error(res, err);
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) return response.notFound(res, { message: 'Blog not found' });
      return response.ok(res, { message: 'Blog deleted successfully' });
    } catch (err) {
      return response.error(res, err);
    }
  },

  getHero: async (req, res) => {
    try {
      let hero = await BlogHero.findOne();
      if (!hero) hero = await BlogHero.create({});
      return response.ok(res, { data: hero });
    } catch (err) {
      return response.error(res, err);
    }
  },

  updateHero: async (req, res) => {
    try {
      const { title, subtitle, description, buttonText } = req.body;
      const updateData = { title, subtitle, description, buttonText };
      if (req.file?.path || req.file?.location) updateData.image = req.file.path || req.file.location;
      else if (req.body.image) updateData.image = req.body.image;

      let hero = await BlogHero.findOne();
      if (!hero) {
        hero = await BlogHero.create(updateData);
      } else {
        hero = await BlogHero.findByIdAndUpdate(hero._id, updateData, { new: true });
      }
      return response.ok(res, { message: 'Hero updated successfully', data: hero });
    } catch (err) {
      return response.error(res, err);
    }
  },
};
