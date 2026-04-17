const User = require('@models/User');
const Booking = require('@models/Booking');
const response = require('../responses');

module.exports = {
  createStaff: async (req, res) => {
    try {
      const payload = req.body;

      const existingStaff = await User.findOne({
        SalonManager: req.user.id,
        $or: [{ email: payload.email }, { mobile: payload.phone }],
      });

      if (existingStaff) {
        if (existingStaff.email === payload.email) {
          return response.badReq(res, {
            message: 'Email already exists',
          });
        }

        if (existingStaff.phone === payload.phone) {
          return response.badReq(res, {
            message: 'Mobile number already exists',
          });
        }
      }

      if (payload.service_ids && typeof payload.service_ids === 'string') {
        payload.service_ids = JSON.parse(payload.service_ids);
      }
      if (req.file && req.file.path) {
        payload.photo = req.file.path;
      }
      payload.SalonManager = req.user.id;
      payload.fullname = payload.name;

      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });

      const staff = await User.create({
        ...payload,
        role: 'staff',
      });

      return response.ok(res, {
        message: 'Staff created successfully',
        data: staff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllStaff: async (req, res) => {
    try {
      const staffList = await User.find({
        SalonManager: req.user.id,
        role: 'staff',
      }).sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Staff list fetched successfully',
        data: staffList,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  updateStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      console.log(payload);
      
      const existingStaff = await User.findOne({
        SalonManager: req.user.id,
        $or: [{ email: payload.email }, { mobile: payload.phone }],
      });

      if (!existingStaff) {
        return response.badReq(res, {
          message: 'User not Found ',
        });
      }

      payload.fullname = payload.name;

      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });
      if (payload.service_ids && typeof payload.service_ids === 'string') {
        payload.service_ids = JSON.parse(payload.service_ids);
      }
      if (req.file && req.file.path) {
        payload.photo = req.file.path;
      }

      const updatedStaff = await User.findOneAndUpdate(
        {
          _id: id,
          SalonManager: req.user.id,
          role: 'staff',
        },
        payload,
        { new: true },
      );

      if (!updatedStaff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff updated successfully',
        data: updatedStaff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  deleteStaff: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedStaff = await User.findOneAndDelete({
        _id: id,
        SalonManager: req.user.id,
        role: 'staff',
      });

      if (!deletedStaff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff deleted successfully',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getStaffById: async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await User.findOne({
        _id: id,
        SalonManager: req.user.id,
        role: 'staff',
      });

      if (!staff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff fetched successfully',
        data: staff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getStaffStats: async (req, res) => {
    try {
      const salonManagerId = req.user.id;

      // Get all staff members (simplified - show all staff)
      const staffMembers = await User.find({
        role: 'staff',
      }).select('fullname email phone image');

      const statsPromises = staffMembers.map(async (staff) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const currentWeekBookings = await Booking.find({
          staff: staff._id,
          SalonManager: salonManagerId,
          date: { $gte: startOfWeek, $lt: endOfWeek },
          status: { $in: ['Confirmed', 'Completed'] },
        }).populate('customer', 'fullname');

        const prevWeekStart = new Date(startOfWeek);
        prevWeekStart.setDate(startOfWeek.getDate() - 7);
        const prevWeekEnd = new Date(startOfWeek);

        const prevWeekBookings = await Booking.find({
          staff: staff._id,
          SalonManager: salonManagerId,
          date: { $gte: prevWeekStart, $lt: prevWeekEnd },
          status: { $in: ['Confirmed', 'Completed'] },
        });

        const servicesRevenue = currentWeekBookings.reduce(
          (sum, b) => sum + (b.price || 0),
          0,
        );
        const prevServicesRevenue = prevWeekBookings.reduce(
          (sum, b) => sum + (b.price || 0),
          0,
        );
        const servicesDelta = servicesRevenue - prevServicesRevenue;

        const totalMinutes = currentWeekBookings.reduce(
          (sum, b) => sum + (b.durationMins || 0),
          0,
        );
        const hoursWorked = Math.round(totalMinutes / 60);

        const prevTotalMinutes = prevWeekBookings.reduce(
          (sum, b) => sum + (b.durationMins || 0),
          0,
        );
        const prevHoursWorked = Math.round(prevTotalMinutes / 60);
        const hourDelta = hoursWorked - prevHoursWorked;

        const avgHour =
          hoursWorked > 0 ? Math.round(servicesRevenue / hoursWorked) : 0;

        const totalAppointments = currentWeekBookings.length;
        const uniqueCustomers = new Set(
          currentWeekBookings.map((b) => b.customer?._id?.toString()),
        );

        const returningCustomerIds = await Booking.distinct('customer', {
          staff: staff._id,
          SalonManager: salonManagerId,
          customer: { $in: Array.from(uniqueCustomers) },
          date: { $lt: startOfWeek },
          status: { $in: ['Confirmed', 'Completed'] },
        });

        const rebookedCount = returningCustomerIds.length;
        const rebookedPercentage =
          totalAppointments > 0
            ? Math.round((rebookedCount / totalAppointments) * 100)
            : 0;

        const prevTotalAppointments = prevWeekBookings.length;
        const prevUniqueCustomers = new Set(
          prevWeekBookings.map((b) => b.customer?._id?.toString()),
        );

        const prevReturningCustomerIds = await Booking.distinct('customer', {
          staff: staff._id,
          SalonManager: salonManagerId,
          customer: { $in: Array.from(prevUniqueCustomers) },
          date: { $lt: prevWeekStart },
          status: { $in: ['Confirmed', 'Completed'] },
        });

        const prevRebookedCount = prevReturningCustomerIds.length;
        const prevRebookedPercentage =
          prevTotalAppointments > 0
            ? Math.round((prevRebookedCount / prevTotalAppointments) * 100)
            : 0;

        const rebookDelta = rebookedPercentage - prevRebookedPercentage;

        return {
          id: staff._id,
          name: staff.fullname || 'Unknown',
          initials: staff.fullname
            ? staff.fullname
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : 'UK',
          services: servicesRevenue,
          servicesDelta: servicesDelta,
          products: 0,
          productsDelta: 0,
          avgHour: avgHour,
          hours: hoursWorked,
          hourDelta: hourDelta,
          rebooked: rebookedPercentage,
          appts: totalAppointments,
          rebookDelta: rebookDelta,
        };
      });

      const staffStats = await Promise.all(statsPromises);

      return response.ok(res, {
        data: staffStats,
      });
    } catch (error) {
      console.error('Error fetching staff stats:', error);
      return response.error(res, error);
    }
  },

  getPendingBookings: async (req, res) => {
    try {
      const salonManagerId = req.user.id;

      const pendingBookings = await Booking.find({
        SalonManager: salonManagerId,
        status: 'Pending',
      })
        .populate('customer', 'fullname')
        .populate('staff', 'fullname')
        .sort({ createdAt: -1 })
        .limit(10);

      return response.ok(res, {
        data: pendingBookings,
      });
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      return response.error(res, error);
    }
  },
};
