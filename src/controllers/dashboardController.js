const Booking = require('@models/Booking');
const response = require('../responses');

module.exports = {
  getDashboardStats: async (req, res) => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

      const baseCond = req.user?.id
        ? {
            $or: [
              { SalonManager: req.user.id },
              { SalonManager: { $exists: false } },
              { SalonManager: null },
            ],
          }
        : {};

      const [
        todayBookings,
        monthBookings,
        lastMonthBookings,
        recentBookings,
        weeklyBookings,
      ] = await Promise.all([
        Booking.find({ ...baseCond, date: { $gte: todayStart, $lte: todayEnd } })
          .populate('customer', 'fullname email phone')
          .populate('staff', 'fullname')
          .populate('service', 'name price duration')
          .sort({ date: 1, startHour: 1 }),

        Booking.find({ ...baseCond, date: { $gte: monthStart } })
          .populate('service', 'name price duration'),

        Booking.find({ ...baseCond, date: { $gte: lastMonthStart, $lte: lastMonthEnd } })
          .populate('service', 'name price duration'),

        Booking.find({ ...baseCond })
          .populate('customer', 'fullname email phone')
          .populate('staff', 'fullname')
          .populate('service', 'name price duration')
          .sort({ createdAt: -1 })
          .limit(5),

        Booking.find({
          ...baseCond,
          date: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6) },
        }),
      ]);

      const calcRevenue = (bookings) =>
        bookings.reduce((sum, b) => sum + (b.totalAmount || b.price || 0), 0);

      const thisMonthRevenue = calcRevenue(monthBookings);
      const lastMonthRevenue = calcRevenue(lastMonthBookings);
      const revenueChange = lastMonthRevenue > 0
        ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
        : 0;

      const todayRevenue = calcRevenue(todayBookings);
      const completedToday = todayBookings.filter(b =>
        ['Completed', 'completed'].includes(b.status)
      ).length;
      const pendingToday = todayBookings.filter(b =>
        ['Pending', 'pending'].includes(b.status)
      ).length;

      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklyData = weekDays.map((_, i) => {
        const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
        const dayBookings = weeklyBookings.filter(b => {
          const bd = new Date(b.date);
          return bd.getFullYear() === dayDate.getFullYear() &&
            bd.getMonth() === dayDate.getMonth() &&
            bd.getDate() === dayDate.getDate();
        });
        return dayBookings.length;
      });

      const uniqueCustomers = new Set();
      monthBookings.forEach(b => {
        const id = b.customer?._id?.toString() || JSON.stringify(b.customer);
        if (id) uniqueCustomers.add(id);
      });

      return response.ok(res, {
        data: {
          todayBookingsCount: todayBookings.length,
          todayRevenue,
          completedToday,
          pendingToday,
          thisMonthRevenue,
          lastMonthRevenue,
          revenueChange: Number(revenueChange),
          activeClientsThisMonth: uniqueCustomers.size,
          recentBookings,
          todayBookings,
          weeklyData,
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
