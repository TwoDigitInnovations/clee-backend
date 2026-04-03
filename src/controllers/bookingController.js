const Booking = require('@models/Booking');
const response = require('../responses');

module.exports = {
  createBooking: async (req, res) => {
    try {
      const payload = req.body;
      payload.SalonManager = req.user.id;

      const booking = await Booking.create(payload);
      const populatedBooking = await Booking.findById(booking._id)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      return response.ok(res, {
        message: 'Booking created successfully',
        data: populatedBooking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllBookings: async (req, res) => {
    try {
      let cond = {
        SalonManager: req.user.id,
      };

      if (req.query.date) {
        const startDate = new Date(req.query.date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(req.query.date);
        endDate.setHours(23, 59, 59, 999);

        cond.date = { $gte: startDate, $lte: endDate };
      }

      if (req.query.staff) {
        cond.staff = req.query.staff;
      }

      if (req.query.status) {
        cond.status = req.query.status;
      }

      const bookings = await Booking.find(cond)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname')
        .sort({ date: 1, startHour: 1 });

      return response.ok(res, {
        data: bookings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found' });
      }

      return response.ok(res, {
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const booking = await Booking.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true },
      )
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found' });
      }

      return response.ok(res, {
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findByIdAndDelete(id);

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found' });
      }

      return response.ok(res, {
        message: 'Booking deleted successfully',
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getUpcomingBookings: async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const bookings = await Booking.find({
        SalonManager: req.user.id,
        date: { $gte: today },
        status: { $in: ['Confirmed', 'Pending'] },
      })
        .populate('customer', 'fullname email phone image')
        .populate('staff', 'fullname')
        .sort({ date: 1, startHour: 1 })
        .limit(20);

      return response.ok(res, {
        data: bookings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
