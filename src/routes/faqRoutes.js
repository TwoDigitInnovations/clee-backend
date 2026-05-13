const express = require('express');
const router = express.Router();
const faqController = require('@controllers/faqController');
const auth = require('@middlewares/authMiddleware');

router.get('/:type', faqController.getFaq);
router.put('/:type', auth('admin'), faqController.updateFaq);

module.exports = router;
