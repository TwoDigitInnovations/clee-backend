const express = require('express');
const router = express.Router();
const controller = require('../controllers/TemplatesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), controller.createTemplate);
router.get('/getAll', auth(), controller.getAllTemplates);

router.get('/:id', auth(), controller.getTemplateById);
router.put('/update/:id', auth(), controller.updateTemplate);
router.delete('/delete/:id', auth(), controller.deleteTemplate);
router.post('/restore/:id', controller.restoreTemplate);
module.exports = router;
