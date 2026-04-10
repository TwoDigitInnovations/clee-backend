const express = require('express');
const router = express.Router();
const controller = require('../controllers/TemplatesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth('admin'), controller.createTemplate);
router.get('/getAll', auth('admin'), controller.getAllTemplates);

router.get('/:id', auth('admin'), controller.getTemplateById);
router.put('/update/:id', auth('admin'), controller.updateTemplate);
router.delete('/delete/:id', auth('admin'), controller.deleteTemplate);
router.post('/restore/:id', controller.restoreTemplate);
module.exports = router;
