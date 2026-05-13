const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClosedDateController');
const auth = require('@middlewares/authMiddleware');

router.post('/add', auth(), controller.createClosedDate);
router.get('/', auth(), controller.getAllClosedDates);
router.get('/:id', auth(), controller.getClosedDateById);
router.put('/update/:id', auth(), controller.updateClosedDate);
router.delete('/delete/:id', auth(), controller.deleteClosedDate);

module.exports = router;
