const express = require('express');
const router = express.Router();
const controller = require('../controllers/automationRulesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), controller.createRules);
router.get('/getAll', auth(), controller.getAllRuless);
router.get('/:id', auth(), controller.getRulesById);
router.put('/update/:id', auth(), controller.updateRules);
router.delete('/delete/:id', auth(), controller.deleteRules);

module.exports = router;
