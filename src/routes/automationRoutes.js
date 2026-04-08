const express = require('express');
const router = express.Router();
const controller = require('../controllers/automationRulesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth('admin'), controller.createRules);
router.get('/getAll', auth('admin'), controller.getAllRuless);
router.get('/:id', auth('admin'), controller.getRulesById);
router.put('/update/:id', auth('admin'), controller.updateRules);
router.delete('/delete/:id', auth('admin'), controller.deleteRules);

module.exports = router;
