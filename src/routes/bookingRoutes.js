const express = require('express');
const router = express.Router();
const bookingController = require('@controllers/bookingController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), bookingController.createBooking);
router.get('/getAll', auth(), bookingController.getAllBookings);
router.get('/upcoming', auth(), bookingController.getUpcomingBookings);
router.get('/cancellation-reasons', auth(), bookingController.getCancellationReasons);
router.get('/:id', auth(), bookingController.getBookingById);
router.put('/update/:id', auth(), bookingController.updateBooking);
router.put('/approve/:id', auth(), bookingController.approveBooking);
router.put('/decline/:id', auth(), bookingController.declineBooking);
router.put('/cancel/:id', auth(), bookingController.cancelBooking);
router.delete('/delete/:id', auth(), bookingController.deleteBooking);

module.exports = router;
