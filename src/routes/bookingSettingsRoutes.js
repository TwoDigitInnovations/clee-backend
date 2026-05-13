const express = require('express');
const router = express.Router();
const bookingSettingsController = require('@controllers/bookingSettingsController');
const auth = require('@middlewares/authMiddleware');


router.get('/get', auth(), bookingSettingsController.getBookingSettings);
router.post('/save', auth(), bookingSettingsController.saveBookingSettings);

module.exports = router;
