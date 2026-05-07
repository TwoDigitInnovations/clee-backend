const express = require('express');
const router = express.Router();
const Service = require('../models/Services');
const CalendarSettings = require('../models/CalendarSettings');
const BookingSettings = require('../models/BookingSettings');
const User = require('../models/User');
const Booking = require('../models/Booking');
const response = require('../responses');
const { sendBookingConfirmation } = require('../services/emailService');

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ onlineBookings: true })
      .populate('category')
      .sort({ createdAt: -1 });
    return response.ok(res, { message: 'Services fetched', data: services });
  } catch (err) {
    return response.error(res, err);
  }
});

router.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('fullname photo jobTitle occupation')
      .sort({ createdAt: -1 });
    return response.ok(res, { message: 'Staff fetched', data: staff });
  } catch (err) {
    return response.error(res, err);
  }
});

router.get('/calendar-settings', async (req, res) => {
  try {
    const settings = await CalendarSettings.findOne().sort({ createdAt: -1 });
    return response.ok(res, { data: settings || {} });
  } catch (err) {
    return response.error(res, err);
  }
});

router.get('/booking-settings', async (req, res) => {
  try {
    const settings = await BookingSettings.findOne().sort({ createdAt: -1 });
    return response.ok(res, { data: settings || {} });
  } catch (err) {
    return response.error(res, err);
  }
});

router.post('/booking/create', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.customer || !payload.services || !payload.date) {
      return response.badReq(res, { message: 'Customer, services and date are required' });
    }
    const booking = await Booking.create(payload);
    const populatedBooking = await Booking.findById(booking._id)
      .populate('staff', 'fullname');

    sendBookingConfirmation(populatedBooking).catch((err) =>
      console.error('[emailService] Failed to send booking confirmation:', err),
    );

    return response.ok(res, { message: 'Booking created successfully', data: populatedBooking });
  } catch (err) {
    return response.error(res, err);
  }
});

module.exports = router;
