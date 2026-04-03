const Waitlist = require('@models/Waitlist');
const Booking = require('@models/Booking');
const response = require('../responses');

module.exports = {
  createWaitlist: async (req, res) => {
    try {
      const payload = req.body;
      payload.SalonManager = req.user.id;

   
      if (payload.service && typeof payload.service === 'string') {
        payload.service = [payload.service];
      }

      const waitlist = await Waitlist.create(payload);
      const populatedWaitlist = await Waitlist.findById(waitlist._id).populate(
        'customer',
        'fullname email phone image',
      );

      return response.ok(res, {
        message: 'Added to waitlist successfully',
        data: populatedWaitlist,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllWaitlist: async (req, res) => {
    try {
      let cond = {
        SalonManager: req.user.id,
        status: 'Active',
      };

      if (req.query.urgent) {
        cond.urgent = req.query.urgent === 'true';
      }

      const waitlist = await Waitlist.find(cond)
        .populate('customer', 'fullname email phone image')
        .sort({ urgent: -1, createdAt: 1 });

      return response.ok(res, {
        data: waitlist,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getWaitlistById: async (req, res) => {
    try {
      const { id } = req.params;

      const waitlist = await Waitlist.findById(id).populate(
        'customer',
        'fullname email phone image',
      );

      if (!waitlist) {
        return response.badReq(res, { message: 'Waitlist entry not found' });
      }

      return response.ok(res, {
        data: waitlist,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateWaitlist: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const waitlist = await Waitlist.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true },
      ).populate('customer', 'fullname email phone image');

      if (!waitlist) {
        return response.badReq(res, { message: 'Waitlist entry not found' });
      }

      return response.ok(res, {
        message: 'Waitlist updated successfully',
        data: waitlist,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteWaitlist: async (req, res) => {
    try {
      const { id } = req.params;

      const waitlist = await Waitlist.findByIdAndDelete(id);

      if (!waitlist) {
        return response.badReq(res, { message: 'Waitlist entry not found' });
      }

      return response.ok(res, {
        message: 'Removed from waitlist successfully',
        data: waitlist,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  convertToBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, startHour, durationMins, staff, price } = req.body;

      const waitlist = await Waitlist.findById(id);

      if (!waitlist) {
        return response.badReq(res, { message: 'Waitlist entry not found' });
      }

      if (waitlist.status !== 'Active') {
        return response.badReq(res, {
          message: 'This waitlist entry is not active',
        });
      }

      const existingBooking = await Booking.findOne({
        staff,
        date: new Date(date),
        startHour,
        status: { $in: ['Confirmed', 'Pending'] },
      });

      if (existingBooking) {
        return response.badReq(res, {
          message: 'This time slot is already booked',
        });
      }

      const booking = await Booking.create({
        customer: waitlist.customer,
        staff,
        service: waitlist.service,
        date: new Date(date),
        startHour,
        durationMins,
        status: 'Confirmed',
        price: price || 0,
        notes: `Converted from waitlist: ${waitlist.notes}`,
        SalonManager: req.user.id,
      });

      waitlist.status = 'Scheduled';
      await waitlist.save();

      const populatedBooking = await Booking.findById(booking._id)
        .populate('customer', 'fullname email phone')
        .populate('staff', 'fullname');

      return response.ok(res, {
        message: 'Waitlist converted to booking successfully',
        data: populatedBooking,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  checkAvailability: async (req, res) => {
    try {
      const { date, startHour, staff } = req.query;

      if (!date || !startHour || !staff) {
        return response.badReq(res, {
          message: 'Date, startHour, and staff are required',
        });
      }

      const existingBooking = await Booking.findOne({
        staff,
        date: new Date(date),
        startHour: parseInt(startHour),
        status: { $in: ['Confirmed', 'Pending'] },
      });

      return response.ok(res, {
        available: !existingBooking,
        message: existingBooking
          ? 'Time slot is already booked'
          : 'Time slot is available',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
