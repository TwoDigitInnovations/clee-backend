const Waitlist = require('@models/Waitlist');
const Booking = require('@models/Booking');
const response = require('../responses');

module.exports = {
  createWaitlist: async (req, res) => {
    try {
      const payload = req.body;
      
      // If user is authenticated, use their ID
      if (req.user && req.user.id) {
        payload.SalonManager = req.user.id;
      } else {
        // For public waitlist, use a default manager or skip
        // You can set a default salon manager ID here
        payload.SalonManager = null;
      }

      // Handle customer data - ensure it stays as object
      if (payload.customer && typeof payload.customer === 'object' && !payload.customer._id) {
        // Customer is an object with details, keep as is
        console.log('Saving customer as object:', payload.customer);
      }

      if (payload.service && typeof payload.service === 'string') {
        payload.service = [payload.service];
      }

      const waitlist = new Waitlist(payload);
      
      // Mark customer field as modified to ensure Mongoose saves it as object
      if (payload.customer && typeof payload.customer === 'object' && !payload.customer._id) {
        waitlist.markModified('customer');
      }
      
      await waitlist.save();
      
      console.log('Saved waitlist customer:', waitlist.customer);
      
      return response.ok(res, {
        message: 'Added to waitlist successfully',
        data: waitlist,
      });
    } catch (error) {
      console.error('Waitlist creation error:', error);
      return response.error(res, error);
    }
  },

  getAllWaitlist: async (req, res) => {
    try {
      let cond = {
        status: 'Active',
      };

      // Filter by SalonManager - include both user's entries and public entries (null SalonManager)
      if (req.user && req.user.id) {
        cond.$or = [
          { SalonManager: req.user.id },
          { SalonManager: null }
        ];
      }

      if (req.query.urgent) {
        cond.urgent = req.query.urgent === 'true';
      }

      const waitlist = await Waitlist.find(cond)
        .populate('customer', 'fullname email phone')
        .populate('service', 'name price duration')
        .sort({ urgent: -1, createdAt: 1 });

      // Format customer data - handle both ObjectId and object types
      const formattedWaitlist = waitlist.map(item => {
        const itemObj = item.toObject();
        
        // Check if customer is populated (ObjectId case)
        if (itemObj.customer && itemObj.customer._id) {
          itemObj.customerName = itemObj.customer.fullname || 'Unknown';
          itemObj.customerEmail = itemObj.customer.email;
          itemObj.customerPhone = itemObj.customer.phone;
        }
        // Check if customer is an embedded object (new format)
        else if (itemObj.customer && typeof itemObj.customer === 'object' && itemObj.customer.firstName) {
          itemObj.customerName = `${itemObj.customer.firstName || ''} ${itemObj.customer.lastName || ''}`.trim();
          itemObj.customerEmail = itemObj.customer.email;
          itemObj.customerPhone = itemObj.customer.phone;
        }
        // Fallback for string IDs that couldn't be populated
        else {
          itemObj.customerName = 'Unknown';
          itemObj.customerEmail = '';
          itemObj.customerPhone = '';
        }
        
        return itemObj;
      });

      return response.ok(res, {
        data: formattedWaitlist,
      });
    } catch (error) {
      console.error('Waitlist fetch error:', error);
      return response.error(res, error);
    }
  },

  getWaitlistById: async (req, res) => {
    try {
      const { id } = req.params;

      const waitlist = await Waitlist.findById(id)
        .populate('customer', 'fullname email phone image')
        .populate('service', 'name price duration');

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
      )
        .populate('customer', 'fullname email phone image')
        .populate('service', 'name price duration');

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
