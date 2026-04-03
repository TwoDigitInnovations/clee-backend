const express = require('express');
const router = express.Router();
const waitlistController = require('@controllers/waitlistController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), waitlistController.createWaitlist);
router.get('/getAll', auth(), waitlistController.getAllWaitlist);
router.get('/check-availability', auth(), waitlistController.checkAvailability);
router.get('/:id', auth(), waitlistController.getWaitlistById);
router.put('/update/:id', auth(), waitlistController.updateWaitlist);
router.post('/convert-to-booking/:id', auth(), waitlistController.convertToBooking);
router.delete('/delete/:id', auth(), waitlistController.deleteWaitlist);

module.exports = router;
