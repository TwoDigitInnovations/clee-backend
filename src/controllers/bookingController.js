const Booking = require('@models/Booking');
const CalendarSettings = require('@models/CalendarSettings');
const response = require('../responses');

module.exports = {
  createBooking: async (req, res) => {
    try {
      const payload = req.body;
      payload.SalonManager = req.user.id;

     
      const settings = await CalendarSettings.findOne({
        SalonManager: req.user.id,
      });

    
      if (!payload.status && settings?.appointmentSettings?.initialStatus) {
        payload.status = settings.appointmentSettings.initialStatus;
      }

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

      if (req.query.customer) {
        cond.customer = req.query.customer;
      }

      if (req.query.status) {
        cond.status = req.query.status;
      }

      const bookings = await Booking.find(cond)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname')
        .populate('service', 'name price duration')
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
        .populate('staff', 'fullname')
        .populate('service', 'name price duration');

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
        .populate('service', 'name price duration')
        .sort({ date: 1, startHour: 1 })
        .limit(20);

      return response.ok(res, {
        data: bookings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  approveBooking: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findOneAndUpdate(
        {
          _id: id,
          SalonManager: req.user.id,
          status: 'Pending',
        },
        { status: 'Confirmed' },
        { new: true },
      )
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname')
        .populate('service', 'name price duration');

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found or already processed' });
      }

      return response.ok(res, {
        message: 'Booking approved successfully',
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  declineBooking: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findOneAndUpdate(
        {
          _id: id,
          SalonManager: req.user.id,
          status: 'Pending',
        },
        { status: 'Cancelled' },
        { new: true },
      )
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname')
        .populate('service', 'name price duration');

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found or already processed' });
      }

      return response.ok(res, {
        message: 'Booking declined successfully',
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;

      const booking = await Booking.findOneAndUpdate(
        {
          _id: id,
          SalonManager: req.user.id,
        },
        { 
          status: 'Cancelled',
          cancellationReason: cancellationReason || 'Other'
        },
        { new: true },
      )
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      if (!booking) {
        return response.badReq(res, { message: 'Booking not found' });
      }

      return response.ok(res, {
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  getCancellationReasons: async (req, res) => {
    try {
      const settings = await CalendarSettings.findOne({
        SalonManager: req.user.id,
      });

      const reasons = settings?.cancellationReasons || [
        'Other',
        'Sickness',
        'Appointment Made In Error',
      ];

      return response.ok(res, {
        data: reasons,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
