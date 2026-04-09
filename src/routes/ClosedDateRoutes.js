const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClosedDateController');
const auth = require('@middlewares/authMiddleware');

router.post('/add', auth('admin'), controller.createClosedDate);
router.get('/', auth('admin'), controller.getAllClosedDates);
router.get('/:id', auth('admin'), controller.getClosedDateById);
router.put('/update/:id', auth('admin'), controller.updateClosedDate);
router.delete('/delete/:id', auth('admin'), controller.deleteClosedDate);

module.exports = router;
