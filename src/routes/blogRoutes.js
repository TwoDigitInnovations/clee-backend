const express = require('express');
const router = express.Router();
const blogController = require('@controllers/blogController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.get('/hero', blogController.getHero);
router.put('/hero', auth('admin'), upload.single('image'), blogController.updateHero);

router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);
router.post('/', auth('admin'), upload.single('image'), blogController.createBlog);
router.put('/:id', auth('admin'), upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth('admin'), blogController.deleteBlog);

module.exports = router;
