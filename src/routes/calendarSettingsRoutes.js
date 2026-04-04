const express = require('express');
const router = express.Router();
const calendarSettingsController = require('@controllers/calendarSettingsController');
const auth = require('@middlewares/authMiddleware');

// Get calendar settings
router.get('/', auth(), calendarSettingsController.getCalendarSettings);

// Update calendar settings
router.put('/', auth(), calendarSettingsController.updateCalendarSettings);

// Cancellation reasons
router.post('/cancellation-reason', auth(), calendarSettingsController.addCancellationReason);
router.delete('/cancellation-reason', auth(), calendarSettingsController.removeCancellationReason);

// Appointment statuses
router.post('/appointment-status', auth(), calendarSettingsController.addAppointmentStatus);
router.put('/appointment-status/:statusId', auth(), calendarSettingsController.updateAppointmentStatus);
router.delete('/appointment-status/:statusId', auth(), calendarSettingsController.removeAppointmentStatus);

module.exports = router;
