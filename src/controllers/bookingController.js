const Booking = require('@models/Booking');
const CalendarSettings = require('@models/CalendarSettings');
const response = require('../responses');
const { sendBookingConfirmation } = require('@services/emailService');


const formatHistoryDate = () => {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

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

      // Add creation history entry
      payload.history = [{
        type: 'alert',
        date: formatHistoryDate(),
        message: `Booking created with status: ${payload.status || 'Pending'}`,
        changedBy: req.user?.name || 'System',
      }];

      const booking = await Booking.create(payload);
      const populatedBooking = await Booking.findById(booking._id)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      sendBookingConfirmation(populatedBooking).catch((err) =>
        console.error('[emailService] Failed to send booking confirmation:', err),
      );

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
      let cond = {};

      
      if (req.user && req.user.id) {
        cond.$or = [
          { SalonManager: req.user.id },
          { SalonManager: { $exists: false } },
          { SalonManager: null },
        ];
      }

      if (req.query.date) {
       
        const dateStr = req.query.date; // e.g. "2026-05-07"
        const startDate = new Date(dateStr + 'T00:00:00.000Z');
        startDate.setHours(startDate.getHours() - 6); // Go back 6 hours to cover IST
        const endDate = new Date(dateStr + 'T23:59:59.999Z');
        endDate.setHours(endDate.getHours() + 6); // Go forward 6 hours to cover IST
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

     
      const historyEntry = {
        type: 'amended',
        date: formatHistoryDate(),
        message: payload.status
          ? `Status changed to: ${payload.status}`
          : `Booking details updated`,
        changedBy: req.user?.name || 'Admin',
      };

      const booking = await Booking.findByIdAndUpdate(
        id,
        {
          $set: payload,
          $push: { history: historyEntry },
        },
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

     
      const cond = {
        date: { $gte: today },
        status: { $in: ['Confirmed', 'Pending', 'pending', 'confirmed'] },
      };

      
      if (req.user && req.user.id) {
        cond.$or = [
          { SalonManager: req.user.id },
          { SalonManager: { $exists: false } },
          { SalonManager: null },
        ];
      }

      console.log('[getUpcomingBookings] Query:', JSON.stringify(cond));
      console.log('[getUpcomingBookings] Today:', today);

      const bookings = await Booking.find(cond)
        .populate('customer', 'fullname email phone image')
        .populate('staff', 'fullname')
        .populate('service', 'name price duration')
        .sort({ date: 1, startHour: 1 })
        .limit(20);

      console.log('[getUpcomingBookings] Found:', bookings.length);

      return response.ok(res, {
        data: bookings,
      });
    } catch (error) {
      console.error('[getUpcomingBookings] Error:', error);
      return response.error(res, error);
    }
  },

  getRecentBookings: async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

   
      const cond = {
        date: { $lt: today },
      };

     
      if (req.user && req.user.id) {
        cond.$or = [
          { SalonManager: req.user.id },
          { SalonManager: { $exists: false } },
          { SalonManager: null },
        ];
      }

      console.log('[getRecentBookings] Query:', JSON.stringify(cond));
      console.log('[getRecentBookings] Today:', today);

      const bookings = await Booking.find(cond)
        .populate('customer', 'fullname email phone image')
        .populate('staff', 'fullname')
        .populate('service', 'name price duration')
        .sort({ date: -1, startHour: -1 })
        .limit(50);

      console.log('[getRecentBookings] Found:', bookings.length);

      return response.ok(res, {
        data: bookings,
      });
    } catch (error) {
      console.error('[getRecentBookings] Error:', error);
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
        {
          status: 'Confirmed',
          $push: {
            history: {
              type: 'alert',
              date: formatHistoryDate(),
              message: 'Booking approved — status changed to Confirmed',
              changedBy: req.user?.name || 'Admin',
            },
          },
        },
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
        {
          status: 'Cancelled',
          $push: {
            history: {
              type: 'alert',
              date: formatHistoryDate(),
              message: 'Booking declined — status changed to Cancelled',
              changedBy: req.user?.name || 'Admin',
            },
          },
        },
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
          cancellationReason: cancellationReason || 'Other',
          $push: {
            history: {
              type: 'alert',
              date: formatHistoryDate(),
              message: `Booking cancelled. Reason: ${cancellationReason || 'Other'}`,
              changedBy: req.user?.name || 'Admin',
            },
          },
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

  
  checkStaffAvailability: async (req, res) => {
    try {
      const { staffId, date, time } = req.query;

      if (!staffId || !date || !time) {
        return response.badReq(res, {
          message: 'Staff ID, date, and time are required',
        });
      }

      
      let dateStr = date;
      const dateParts = dateStr.split('-');
      if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = dateParts[1].padStart(2, '0');
        const day = dateParts[2].padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      }

      const startDate = new Date(dateStr + 'T00:00:00.000Z');
      const endDate = new Date(dateStr + 'T23:59:59.999Z');

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return response.badReq(res, { message: 'Invalid date format' });
      }

    
      const startDateWide = new Date(dateStr + 'T00:00:00.000Z');
      startDateWide.setHours(startDateWide.getHours() - 6); // Go back 6 hours to cover IST
      const endDateWide = new Date(dateStr + 'T23:59:59.999Z');
      endDateWide.setHours(endDateWide.getHours() + 6); // Go forward 6 hours to cover IST

  
      const existingBookings = await Booking.find({
        staff: staffId,
        date: { $gte: startDateWide, $lte: endDateWide },
        time: time,
        status: { $nin: ['cancelled', 'no-show', 'Cancelled', 'No-show'] },
      }).populate('customer', 'fullname');

      const isAvailable = existingBookings.length === 0;

      return response.ok(res, {
        data: {
          available: isAvailable,
          bookingCount: existingBookings.length,
          existingBookings: existingBookings.map(b => ({
            id: b._id,
            customerName: b.customer?.fullname || 'Unknown',
            status: b.status,
          })),
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

