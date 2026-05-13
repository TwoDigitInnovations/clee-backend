const express = require('express');
const router = express.Router();
const calendarSettingsController = require('@controllers/calendarSettingsController');
const auth = require('@middlewares/authMiddleware');

router.get('/', auth(), calendarSettingsController.getCalendarSettings);
router.put('/', auth(), calendarSettingsController.updateCalendarSettings);
router.post('/cancellation-reason', auth(), calendarSettingsController.addCancellationReason);
router.delete('/cancellation-reason', auth(), calendarSettingsController.removeCancellationReason);
router.post('/appointment-status', auth(), calendarSettingsController.addAppointmentStatus);
router.put('/appointment-status/:statusId', auth(), calendarSettingsController.updateAppointmentStatus);
router.delete('/appointment-status/:statusId', auth(), calendarSettingsController.removeAppointmentStatus);

module.exports = router;
